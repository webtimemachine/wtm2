//
//  Login.swift
//  wtm (iOS)
//
//  Created by Juan Ignacio Martel Sanchez on 9/8/24.
//

import Foundation

struct LoginRequest: Codable {
    let email: String
    let password: String
    let deviceKey: String = "deviceKey"
}

struct LoginResponse: Codable {
    let accessToken: String
    let refreshToken: String
    let user: User
    let userDevice: UserDevice
}


struct DeviceDetail: Codable {
    let id: Int
    let deviceKey: String
    let userAgent: String
}

struct UserDevice: Codable {
    let id: Int
    let userId: Int
    let deviceId: Int
    let isCurrentDevice: Bool
    let deviceAlias: String?
    let device: DeviceDetail
}

struct User: Codable {
    let id: Int
    let email: String
}
