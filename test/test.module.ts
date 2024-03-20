import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AssignUserMiddleware} from 'presentation/middlewares/assign-user.middleware';
import {ConfigModule} from '@nestjs/config';
import {CqrsModule} from "@nestjs/cqrs";
import {CoreModule} from "infrastructure/modules/core.module";
import {RequestUserService} from "infrastructure/services";
import {IAccessTokenService, IJwtTokenService} from "application/modules/oauth2/services";
import {IClientRepository} from "domain/repositories";
import {AccessTokenEntity, ClientEntity, UserEntity} from "domain/entities";
import {JwtPayloadModel} from "infrastructure/modules/oauth2/models";
import {JwtPayload} from "jsonwebtoken";

const expiresAt = new Date();
expiresAt.setHours(expiresAt.getHours() + 1);
export const mockedClient: ClientEntity = {
    id: '37679e0b-2dea-4e9b-a555-b8e5e9c775cf',
    secret: 'yINXGeC5Xj0R5XCbI3oPNqlL6P0HNzdD',
    grants: ['client_credentials', 'password', 'refresh_token'],
    scopes: ['application', 'user'],
    accessTokenLifetime: 3600,
    refreshTokenLifetime: 7200,
    privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIIEogIBAAKCAQEA2EJSNG0GkMHgRSJm7iq5iTUO7/THsPjnUI+wz18RF4swAXZm\n' +
        'RspGZ43/ws7vmj/Z87138/SHdCxEImtcLaqpzmIUd137twElEYTqdR6lMsa5rBkn\n' +
        '+nsAcvzhE6ZAVd0nJbou1VcPAXiuC/iJhzHlVtqeHa5/qk6XTlnm4tVaA/FR9X8y\n' +
        'v5UOlSssdvpiJFUymsZgGmQXLvIUEOkO+MnlLzXeeDdwHT12OSQoqHqz3OuKwARE\n' +
        'NGbIT3+xUjmCE5nBEasE7ZFgH4mSuOzyfw4Ck9cy6f4kS+LwgadeN8efAJtXmS+v\n' +
        'IfyfM6mZavwPuQlElItLwznvzIPwX2Eq8tgw9wIDAQABAoIBAAt91rVvd7JYgwzZ\n' +
        'a6PLRGmslpscpEHcsBoBULFsSVG5dTcWrg+j7wLQsl8NNQE61F+V2Vpuy4XaVlKH\n' +
        '5vGMSJKtdo3zQg1y85/PMtA/bSLaGYKyIYQ3Zgo2MtWi93c4lbx0/MkcY7E90u3S\n' +
        '6qfy+E9ZtZ45KBKKM5MXxuOV178uygrq9PRe8xegv8JDyZ91gdXOHKXD7v/kkPy8\n' +
        'R28zjnRmOV9O0rwk0vSsQHnN1v9Q7y06u6HIvvGHfEPqzscBH9+24yovTPDhwOhy\n' +
        'RVefQWSKdd83klp9S6XfjxpUoHXE2aZ4MiV5f2oUm+u5+NX7mJLk1VRYx+WQDzuv\n' +
        'froS3QUCgYEA/a1prSd73vb8//2NKpPdVrrZyNWSgKlf1rNiOv0QdEtU2O4QtqJh\n' +
        '35Jd78l1uIDDpkTILa/8m6rt5svPr/s8PnD/O6gmaUjYfXv5e6Gl4pvkTAQk1ti/\n' +
        'sRp/RusJJSKlOmhrnArjujBkr6wv1ub/mxhkbiEPMoYYuDs4OEZD/OsCgYEA2j00\n' +
        'Xmz918Rq3WmxJh/NzsRTLZtMOHpbJwhhzZbeZ73Jlq8AmzIwOng6GbLabxc1RZ0E\n' +
        '9yCF6Ger3ZuwcyuYcBP9WtptDM4KOtLvlXP8Uh4cjU/3GxcztDLWt3yxVUQ6cqjb\n' +
        'QjKnLqCwpHlNMP6zSH0dQZgpUyM15wqPwjnJKSUCgYBFcfStD1MMzcai+bFsh4Af\n' +
        'XxWBsl3h1PxElWT9ywt3GqxGmp1+seNjRflrTFZqxO1KlifKwhPANcHc3cykW325\n' +
        'hkuI9FZXmjaR25+Hpc/4wj50ROok2r9XZ26SZoNhZCOhYraayCxhayAVK2kJRsGQ\n' +
        'ntPXhjtX1Hft72BLn4i7MwKBgA3WEYrnCBT06/2LpOKQ46B3S/q5PNTb1Qmde23o\n' +
        'YcNcAfrer4AnZ21dj/lvIHAonYUDVnxAgJzibcAIDeDPY8O/ULHA5WcJbRabpvrn\n' +
        'tpiSNiczaaw7BVkoW/qYGjoYsEfysqv4wCaxo2FaG22+yCkRXZh6CCywL8utHL4o\n' +
        'obtNAoGANaiG03jY+f5iFLtSYzEtgVo8RYmD8Xtt2r9U6Nr/oys8WZ6cSxv3qJ45\n' +
        'lqM1KejgeMIABg7FSGiB3SrWwkwFO33KFXNW2h0/q83Kf0U5FDDpE5GYZXXrCC0v\n' +
        'o0Y061kuxOtap4e6zwiHTUaRn207E2ykyXOXJIRheJ61D1zsawY=\n' +
        '-----END RSA PRIVATE KEY-----\n',
    publicKey: '-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2EJSNG0GkMHgRSJm7iq5\n' +
        'iTUO7/THsPjnUI+wz18RF4swAXZmRspGZ43/ws7vmj/Z87138/SHdCxEImtcLaqp\n' +
        'zmIUd137twElEYTqdR6lMsa5rBkn+nsAcvzhE6ZAVd0nJbou1VcPAXiuC/iJhzHl\n' +
        'VtqeHa5/qk6XTlnm4tVaA/FR9X8yv5UOlSssdvpiJFUymsZgGmQXLvIUEOkO+Mnl\n' +
        'LzXeeDdwHT12OSQoqHqz3OuKwARENGbIT3+xUjmCE5nBEasE7ZFgH4mSuOzyfw4C\n' +
        'k9cy6f4kS+LwgadeN8efAJtXmS+vIfyfM6mZavwPuQlElItLwznvzIPwX2Eq8tgw\n' +
        '9wIDAQAB\n' +
        '-----END PUBLIC KEY-----\n',
    cert: '-----BEGIN CERTIFICATE-----\n' +
        'MIIC8DCCAdigAwIBAgIJAdMfEQPq1HEXMA0GCSqGSIb3DQEBBQUAMBQxEjAQBgNV\n' +
        'BAMTCWxvY2FsaG9zdDAeFw0yNDAzMTkxMzQyNDhaFw0yNTAzMTkxMzQyNDhaMBQx\n' +
        'EjAQBgNVBAMTCWxvY2FsaG9zdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\n' +
        'ggEBANhCUjRtBpDB4EUiZu4quYk1Du/0x7D451CPsM9fEReLMAF2ZkbKRmeN/8LO\n' +
        '75o/2fO9d/P0h3QsRCJrXC2qqc5iFHdd+7cBJRGE6nUepTLGuawZJ/p7AHL84ROm\n' +
        'QFXdJyW6LtVXDwF4rgv4iYcx5Vbanh2uf6pOl05Z5uLVWgPxUfV/Mr+VDpUrLHb6\n' +
        'YiRVMprGYBpkFy7yFBDpDvjJ5S813ng3cB09djkkKKh6s9zrisAERDRmyE9/sVI5\n' +
        'ghOZwRGrBO2RYB+Jkrjs8n8OApPXMun+JEvi8IGnXjfHnwCbV5kvryH8nzOpmWr8\n' +
        'D7kJRJSLS8M578yD8F9hKvLYMPcCAwEAAaNFMEMwDAYDVR0TBAUwAwEB/zALBgNV\n' +
        'HQ8EBAMCAvQwJgYDVR0RBB8wHYYbaHR0cDovL2V4YW1wbGUub3JnL3dlYmlkI21l\n' +
        'MA0GCSqGSIb3DQEBBQUAA4IBAQB/Tp3uDWOxp0gRrOs6Voa88fSp5S5yvgKfV9Mg\n' +
        'PsF88aFFXTfvhcS706Us5qm/5KIUa+LWRGOqk0F+TtNCFcoPyTdA3Ojh94kVhkwg\n' +
        '2Docrcx2EQWQwnrbOKJlpLIyI5ieJuLpVDKTuV80sTJbPGL2oWQzRDK2g3Zhd9RT\n' +
        'bVrCBmQLgQAXNzPiMO4O3pEuQnsi4/m33zU5sFoq2sgN6/KrH1YcZli/8AdVaxnN\n' +
        '6QkFesMNtSXPt/HBjctVEDoNB4PbvdmOqOCwpfYJaGRjB0pXjrY4u3WoOPEikR45\n' +
        '89XTeolbLAXd2GGqNOOiHKKzt0VcKh9wVdMN5n2iEUr0mr3d\n' +
        '-----END CERTIFICATE-----\n',
    certExpiresAt: expiresAt,
    createdAt: new Date(),
    deletedAt: null
};

const mockedUser: UserEntity = {
    id: '2c5f18d7-e98a-4113-be70-fa679921e812',
    email: 'test@gmail.com',
    password: '$2a$10$e/5/2A8xwiOK5RYo2pw.mO3C/Z2eli6o6b/gueO50XpvJNyU3zNW2',
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockedAccessToken: AccessTokenEntity = {
    id: '229d9da1-46c2-4ce9-9015-e43e24e90af8',
    clientId: mockedClient.id,
    userId: null,
    scopes: ['application'],
    revoked: false,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
    client: mockedClient,
    user: null,
    refreshToken: null,
};

export const mockedAppJwtPayload: JwtPayload = {
    jti: mockedAccessToken.id,
    aud: mockedClient.id,
    sub: '',
    exp: expiresAt.getTime() / 1000,
    scopes: ['application']
};

export const mockedUserJwtPayload: JwtPayload = {
    jti: mockedAccessToken.id,
    aud: mockedClient.id,
    sub: mockedUser.id,
    exp: expiresAt.getTime() / 1000,
    scopes: ['user']
};

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CqrsModule.forRoot(),
        CoreModule,
    ],
    providers: [
        RequestUserService,
        {
            provide: IJwtTokenService,
            useValue: {
                decode: jest.fn((token: 'application' | 'user') => Promise.resolve(token === 'application' ? mockedAppJwtPayload : mockedUserJwtPayload)),
                verify: jest.fn((token: 'application' | 'user') => Promise.resolve(token === 'application' ? mockedAppJwtPayload : mockedUserJwtPayload)),
            },
        },
        {
            provide: IClientRepository,
            useValue: {
                find: jest.fn(() => Promise.resolve(mockedClient)),
            },
        },
        {
            provide: IAccessTokenService,
            useValue: {
                verify: jest.fn(() => Promise.resolve({})),
            },
        },
    ]
})
export class TestModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AssignUserMiddleware).forRoutes({path: '*', method: RequestMethod.ALL});
    }
}
