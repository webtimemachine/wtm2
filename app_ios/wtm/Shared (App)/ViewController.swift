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
    private var email: String = ""
    private var password: String = ""
    
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
        return textField
    }()
    
    private let passwordTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Password"
        textField.borderStyle = .roundedRect
        textField.isSecureTextEntry = true
        return textField
    }()
    
    private var button: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Open URL", for: .normal)
        button.isEnabled = false
        return button
    }()
    
    private func setupUI() {
        view.addSubview(baseUrlTextField)
        view.addSubview(emailTextField)
        view.addSubview(passwordTextField)
        view.addSubview(button)
        
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
            button.centerXAnchor.constraint(equalTo: view.centerXAnchor)
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
        let contactsVC = ContactsViewController()
        navigationController?.pushViewController(contactsVC, animated: true)
    }
}

