import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {IUserRepository} from "domain/repositories";
import {getRepositoryToken} from "@nestjs/typeorm";
import {UserModule} from "infrastructure/modules/user/user.module";
import {TestModule} from "../test.module";
import {UserModel} from "infrastructure/modules/user/models";

const mockedUser = {
    id: '2c5f18d7-e98a-4113-be70-fa679921e812',
    email: 'test@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('UserController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const mockedUserRepository = {
            save: jest.fn(() => Promise.resolve(mockedUser)),
            findById: jest.fn(() => Promise.resolve(mockedUser)),
            findByEmail: jest.fn(() => Promise.resolve(null)),
        };
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [TestModule, UserModule],
        })
            .overrideProvider(IUserRepository)
            .useValue(mockedUserRepository)
            .overrideProvider(getRepositoryToken(UserModel))
            .useValue(null)
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it('/user/sign-up (POST)', () => {
        return request(app.getHttpServer())
            .post('/user/sign-up')
            .set('Authorization', 'Bearer application')
            .send({
                email: 'test@gmail.com',
                password: '1Qw@1111',
            })
            .expect(201);
    });

    it('/user/information (GET)', () => {
        return request(app.getHttpServer())
            .get('/user/information')
            .set('Authorization', 'Bearer application')
            .expect(403);
    });

    it('/user/information (GET)', () => {
        return request(app.getHttpServer())
            .get('/user/information')
            .set('Authorization', 'Bearer user')
            .expect(200)
            .expect({
                id: mockedUser.id,
                email: mockedUser.email,
                createdAt: mockedUser.createdAt.toISOString(),
                updatedAt: mockedUser.updatedAt.toISOString()
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
