@preconcurrency import WebKit
import UIKit

class WebViewController: UIViewController, WKNavigationDelegate {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        webView.configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        webView.navigationDelegate = self
        webView.scrollView.isScrollEnabled = false

        // Carga la webapp embebida
        if let url = URL(string: "https://webtm.vercel.app/login") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    // Implementa el manejador de mensajes
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url, navigationAction.navigationType == .linkActivated {
                // Verifica si el enlace debe abrirse en Safari
                if url.host != "https://webtm.vercel.app" {  // Puedes ajustar esto según tu lógica
                    // Abre el enlace en Safari
                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
                    decisionHandler(.cancel)
                    return
                }
            }
            decisionHandler(.allow)
        }
}
