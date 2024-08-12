//
//  AuthService.swift
//  wtm (iOS)
//
//  Created by Juan Ignacio Martel Sanchez on 9/8/24.
//

import Foundation

final class AuthService {
    
    enum LoginError: Error {
        case networkError(String)
        case noResponse
        case invalidResponse
        case serverError(String)
        case malformedURL(String)
        case decodingError(String)
    }
    
    func doLogin(url: String, request: LoginRequest, completion: @escaping (Result<LoginResponse, LoginError>) -> Void) {
        guard let url = URL(string: url) else {
            return completion(.failure(.malformedURL(url)))
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let jsonData = try JSONEncoder().encode(request)
            urlRequest.httpBody = jsonData
        } catch {
            return completion(.failure(.decodingError("Error encoding request data.")))
        }
        
        let task = URLSession.shared.dataTask(with: urlRequest) { data, response, error in
            if let error = error {
                completion(.failure(.networkError(error.localizedDescription)))
                return
            }
            
            guard let data = data else {
                completion(.failure(.noResponse))
                return
            }
            
            do {
                let loginResponse = try JSONDecoder().decode(LoginResponse.self, from: data)
                completion(.success(loginResponse))
            } catch {
                completion(.failure(.decodingError("Error processing server response.")))
            }
        }
        
        task.resume()
    }
}
