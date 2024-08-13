//
//  WebViewController.swift
//  wtm
//
//  Created by Maxi Cassola on 12/08/2024.
//

import UIKit
import WebKit

class WebViewController: UIViewController {

    // Conecta la WKWebView desde el Storyboard
    @IBOutlet weak var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
                
        if let accessToken = UserDefaults.standard.value(forKey:"access_token") {
            let urlString = "https://webtm.vercel.app/login?accessToken=\(String(describing: accessToken))"
            if let url = URL(string: urlString) {
                let request = URLRequest(url: url)
                webView.load(request)
            }
        }
    }
}
