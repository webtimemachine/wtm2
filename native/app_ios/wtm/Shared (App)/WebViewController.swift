@preconcurrency import WebKit
import UIKit

class WebViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
        webView.configuration.userContentController.add(self, name: "iosListener")
        webView.configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        webView.navigationDelegate = self
        webView.scrollView.isScrollEnabled = false
        
        let datosAEnviar = "Este es un mensaje desde Swift"
        webView.evaluateJavaScript("window.receiveMessageFromiOS('\(datosAEnviar)')", completionHandler: nil)

        // Carga la webapp embebida
        if let url = URL(string: "http://192.168.1.81:3000/login") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
        
        let button = UIButton(type: .system)
        button.setTitle("Enviar mensaje a WebApp", for: .normal)
        button.addTarget(self, action: #selector(sendMessageToWebApp), for: .touchUpInside)
        button.frame = CGRect(x: 50, y: 400, width: 250, height: 50)
        self.view.addSubview(button)
        
    }

    // Implementa el manejador de mensajes
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url, navigationAction.navigationType == .linkActivated {
                // Verifica si el enlace debe abrirse en Safari
                if url.host != "http://192.168.1.81:3000" {  // Puedes ajustar esto según tu lógica
                    // Abre el enlace en Safari
                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
                    decisionHandler(.cancel)
                    return
                }
            }
            decisionHandler(.allow)
        }
    // Implementar la recepción de mensajes desde la WebApp
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "iosListener", let messageBody = message.body as? String {
                print("Mensaje recibido desde la WebApp: \(messageBody)")
            }
        }
    
    @objc func sendMessageToWebApp() {
            let message = "Hola desde Swift"
            webView.evaluateJavaScript("window.receiveMessageFromiOS('\(message)')", completionHandler: { (result, error) in
                if let error = error {
                    print("Error al enviar mensaje: \(error.localizedDescription)")
                } else {
                    print("Mensaje enviado con éxito a la webapp")
                }
            })
        }
}
