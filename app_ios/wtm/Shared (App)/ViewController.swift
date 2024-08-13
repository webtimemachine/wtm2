//
//  ViewController.swift
//  Shared (App)
//
//  Created by Juan Ignacio Martel Sanchez on 9/8/24.
//

import WebKit

#if os(iOS)
import UIKit
typealias PlatformViewController = UIViewController
#elseif os(macOS)
import Cocoa
import SafariServices
typealias PlatformViewController = NSViewController
#endif

let extensionBundleIdentifier = "com.ttt246llc.wtm.Extension"

@available(iOS 17.0, *)
class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()

        self.webView.navigationDelegate = self

#if os(iOS)
        self.webView.scrollView.isScrollEnabled = false
#endif

        self.webView.configuration.userContentController.add(self, name: "controller")

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
#if os(iOS)
        webView.evaluateJavaScript("show('ios')")
#elseif os(macOS)
        webView.evaluateJavaScript("show('mac')")

        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), true)")
                } else {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), false)")
                }
            }
        }
#endif
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
#if os(macOS)
        if (message.body as! String != "open-preferences") {
            return
        }

        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                NSApp.terminate(self)
            }
        }
#endif
    }


    private var baseUrl: String = ""
    private let loginService = AuthService()

    private let baseUrlTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Base URL"
        textField.borderStyle = .roundedRect
        textField.text = "https://wtm-back.vercel.app"
        return textField
    }()
    
    private let emailTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Email"
        textField.borderStyle = .roundedRect
        textField.keyboardType = .emailAddress
        return textField
    }()
    
    private let passwordTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Password"
        textField.borderStyle = .roundedRect
        textField.isSecureTextEntry = true
        return textField
    }()
    
    private let button: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Open URL", for: .normal)
        button.isEnabled = false
        return button
    }()
    
    private let loadingIndicator: UIActivityIndicatorView = {
        let view = UIActivityIndicatorView(style: .large)
        view.startAnimating()
        view.isHidden = true
        return view
    }()
    
    private func setupUI() {
        view.addSubview(baseUrlTextField)
        view.addSubview(emailTextField)
        view.addSubview(passwordTextField)
        view.addSubview(button)
        button.addSubview(loadingIndicator)

        setupConstraints()
        
        baseUrlTextField.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
        emailTextField.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
        passwordTextField.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
        button.addTarget(self, action: #selector(didTapGoToUrl), for: .touchUpInside)
    }
    
    private func setupConstraints() {
        baseUrlTextField.translatesAutoresizingMaskIntoConstraints = false
        emailTextField.translatesAutoresizingMaskIntoConstraints = false
        passwordTextField.translatesAutoresizingMaskIntoConstraints = false
        button.translatesAutoresizingMaskIntoConstraints = false
        loadingIndicator.translatesAutoresizingMaskIntoConstraints = false

        NSLayoutConstraint.activate([
            baseUrlTextField.bottomAnchor.constraint(equalTo: emailTextField.topAnchor, constant: -32),
            baseUrlTextField.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            baseUrlTextField.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            
            emailTextField.bottomAnchor.constraint(equalTo: passwordTextField.topAnchor, constant: -32),
            emailTextField.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            emailTextField.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            
            passwordTextField.bottomAnchor.constraint(equalTo: view.centerYAnchor),
            passwordTextField.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            passwordTextField.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            
            button.topAnchor.constraint(equalTo: passwordTextField.bottomAnchor, constant: 32),
            button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            button.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            button.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),

            loadingIndicator.topAnchor.constraint(equalTo: button.centerYAnchor),
            loadingIndicator.bottomAnchor.constraint(equalTo: button.centerYAnchor),
            loadingIndicator.leadingAnchor.constraint(equalTo: button.leadingAnchor),
            loadingIndicator.trailingAnchor.constraint(equalTo: button.trailingAnchor),
        ])
    }
    
    @objc
    private func textFieldDidChange() {
        baseUrl = baseUrlTextField.text ?? ""

        let isValid = !baseUrlTextField.text!.isEmpty &&
                      !emailTextField.text!.isEmpty &&
                      !passwordTextField.text!.isEmpty
        button.isEnabled = isValid
    }
    
    @objc
    private func didTapGoToUrl() {
        doLogin()
    }
    
    private func doLogin() {
        loadingIndicator.isHidden = false
        button.isEnabled = false

        let request = LoginRequest(email: emailTextField.text ?? "", password: passwordTextField.text ?? "")
        loginService.doLogin(url: "\(baseUrl)/api/auth/login", request: request) { [weak self] result in
            guard let self else { return }
            
            DispatchQueue.main.async {
                switch result {
                case .success(let loginResponse):
                    let accessToken = loginResponse.accessToken
                    UserDefaults.standard.set(accessToken, forKey: "access_token")

                    let storyboard = UIStoryboard(name: "Main", bundle: nil)
                            if let tabBarController = storyboard.instantiateViewController(withIdentifier: "MainTabBarController") as? UITabBarController {
                                // Presenta el TabBarController
                                tabBarController.modalPresentationStyle = .fullScreen
                                self.navigationController?.pushViewController(tabBarController, animated: true)
                            }
                    
                case .failure(let error):
                    self.showAlert(message: error.localizedDescription)
                }
                
                self.loadingIndicator.isHidden = true
                self.button.isEnabled = true
            }
        }
    }
    
    private func showAlert(message: String) {
        let alert = UIAlertController(title: "Alert", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        present(alert, animated: true, completion: nil)
    }
}
