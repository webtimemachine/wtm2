@preconcurrency import WebKit
import UIKit

class WebViewController: UIViewController, WKNavigationDelegate {
    @IBOutlet var webView: WKWebView!
    
    deinit {
         NotificationCenter.default.removeObserver(self)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        NotificationCenter.default.addObserver(self, selector: #selector(refreshReadOnlyWebPage), name: UIApplication.willEnterForegroundNotification, object: nil)


        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
        
        webView.navigationDelegate = self
        webView.scrollView.isScrollEnabled = false
        
        refreshReadOnlyWebPage()
    }
    
    @objc func refreshReadOnlyWebPage() {
        if let sharedDefaults = UserDefaults(suiteName: "group.com.ttt246llc.wtm") {
            if let data = sharedDefaults.dictionary(forKey: "messageFromExtension") {
                
                if let url = URL(string: "https://webtm.io/hold?token=\(data["refreshToken"] ?? "")&backUrl=\(data["backUrl"] ?? "") ?? "")") {
                    let request = URLRequest(url: url)
                    webView.load(request)
                }
            } else {
                if let url = URL(string: "https://webtm.io/hold") {
                    let request = URLRequest(url: url)
                    webView.load(request)
                }
            }
        } else {
            if let url = URL(string: "https://webtm.io/hold") {
                let request = URLRequest(url: url)
                webView.load(request)
            }
        }
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url, navigationAction.navigationType == .linkActivated {
                if url.host != "https://webtm.io" {
                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
                    decisionHandler(.cancel)
                    return
                }
            }
            decisionHandler(.allow)
        }
        
}
