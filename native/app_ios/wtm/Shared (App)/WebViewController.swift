import WebKit
import UIKit

class WebViewController: UIViewController, WKScriptMessageHandler, WKUIDelegate {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let contentController = WKUserContentController()
        contentController.add(self, name: "openLink")

        let config = WKWebViewConfiguration()
        config.userContentController = contentController
        
        // Configura la webView con la configuración deseada
        self.webView = WKWebView(frame: self.view.frame, configuration: config)
                
        self.view.addSubview(self.webView)

        // Delegate the webview's uiDelegate
        self.webView.uiDelegate = self

        // Carga la webapp embebida
        if let url = URL(string: "https://webtm.vercel.app/login") {
            let request = URLRequest(url: url)
            self.webView.load(request)
        }
    }

    // Implementa el manejador de mensajes
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "openLink", let urlString = message.body as? String, let url = URL(string: urlString) {
            // Abre Safari
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
    }
}
