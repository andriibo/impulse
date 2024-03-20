import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {OAuth2Module} from "infrastructure/modules/oauth2/oauth2.module";
import {IAccessTokenRepository, IClientRepository, IRefreshTokenRepository, IUserRepository} from "domain/repositories";
import {RefreshTokenEntity, UserEntity} from "domain/entities";
import {getRepositoryToken} from "@nestjs/typeorm";
import {AccessTokenModel, ClientModel, RefreshTokenModel} from "infrastructure/modules/oauth2/models";
import {UserModule} from "infrastructure/modules/user/user.module";
import {mockedAccessToken, mockedAppJwtPayload, mockedClient, TestModule} from "tests/test.module";
import {UserModel} from "infrastructure/modules/user/models";
import {IJwtTokenService} from "application/modules/oauth2/services";

const expiresAt = new Date();
expiresAt.setHours(expiresAt.getHours() + 1);

const mockedRefreshToken: RefreshTokenEntity = {
    id: '319bd4cf-945f-496d-8f2e-5d2d217ba1da',
    accessTokenId: mockedAccessToken.id,
    revoked: false,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
    accessToken: mockedAccessToken,
};

const mockedUser: UserEntity = {
    id: '2c5f18d7-e98a-4113-be70-fa679921e812',
    email: 'test@gmail.com',
    password: '$2a$10$e/5/2A8xwiOK5RYo2pw.mO3C/Z2eli6o6b/gueO50XpvJNyU3zNW2',
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('OAuth2Controller (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const mockedClientRepository = {
            find: jest.fn(() => Promise.resolve(mockedClient)),
        };
        const mockedAccessTokenRepository = {
            create: jest.fn(() => Promise.resolve(mockedAccessToken)),
            find: jest.fn(() => Promise.resolve(mockedAccessToken)),
            revoke: jest.fn(() => Promise.resolve({})),
        };
        const mockedRefreshTokenRepository = {
            create: jest.fn(() => Promise.resolve(mockedRefreshToken)),
            find: jest.fn(() => Promise.resolve(mockedRefreshToken)),
            revokeByAccessTokenIds: jest.fn(() => Promise.resolve({})),
        };
        const mockedUserRepository = {
            findByEmail: jest.fn(() => Promise.resolve(mockedUser)),
        };
        const mockedJwtTokenService = {
            verify: jest.fn(() => Promise.resolve(mockedAppJwtPayload)),
            decode: jest.fn(() => Promise.resolve(mockedAppJwtPayload)),
            generate: jest.fn(() => Promise.resolve('jwt-token'))
        };
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [TestModule, OAuth2Module, UserModule],
        })
            .overrideProvider(IClientRepository)
            .useValue(mockedClientRepository)
            .overrideProvider(IAccessTokenRepository)
            .useValue(mockedAccessTokenRepository)
            .overrideProvider(IRefreshTokenRepository)
            .useValue(mockedRefreshTokenRepository)
            .overrideProvider(IUserRepository)
            .useValue(mockedUserRepository)
            .overrideProvider(IJwtTokenService)
            .useValue(mockedJwtTokenService)
            .overrideProvider(getRepositoryToken(ClientModel))
            .useValue(null)
            .overrideProvider(getRepositoryToken(AccessTokenModel))
            .useValue(null)
            .overrideProvider(getRepositoryToken(RefreshTokenModel))
            .useValue(null)
            .overrideProvider(getRepositoryToken(UserModel))
            .useValue(null)
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it('/oauth/2.0/token (POST) client_credentials grant', () => {
        return request(app.getHttpServer())
            .post('/oauth/2.0/token')
            .send({
                grantType: 'client_credentials',
                clientId: mockedClient.id,
                clientSecret: mockedClient.secret,
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveProperty('accessToken');
                expect(body).toHaveProperty('expiresIn');
                expect(body).toHaveProperty('tokenType');
            });
    });

    it('/oauth/2.0/token (POST) password grant', () => {
        return request(app.getHttpServer())
            .post('/oauth/2.0/token')
            .send({
                grantType: 'password',
                clientId: mockedClient.id,
                clientSecret: mockedClient.secret,
                username: 'test@gmail.com',
                password: '1Qw@1111',
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveProperty('accessToken');
                expect(body).toHaveProperty('expiresIn');
                expect(body).toHaveProperty('tokenType');
                expect(body).toHaveProperty('refreshToken');
            });
    });

    it('/oauth/2.0/token (POST) refresh_token grant', () => {
        return request(app.getHttpServer())
            .post('/oauth/2.0/token')
            .send({
                grantType: 'refresh_token',
                clientId: mockedClient.id,
                clientSecret: mockedClient.secret,
                refreshToken: 'token',
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveProperty('accessToken');
                expect(body).toHaveProperty('expiresIn');
                expect(body).toHaveProperty('tokenType');
            });
    });

    it('/oauth/2.0/revoke-token (POST)', () => {
        return request(app.getHttpServer())
            .post('/oauth/2.0/revoke-token')
            .set('Authorization', 'Bearer application')
            .expect(204);
    });

    afterAll(async () => {
        await app.close();
    });
});
