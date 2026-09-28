import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';

const mockDb = { query: jest.fn() };

jest.mock('jsonwebtoken', () => ({ sign: jest.fn().mockReturnValue('mock-token') }));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.resetAllMocks();
    (jwt.sign as jest.Mock).mockReturnValue('mock-token');
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: mockDb },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ id: 1, email: 'a@b.com' }] })
        .mockResolvedValueOnce({ rows: [{ id: 1, email: 'a@b.com', created_at: new Date() }] });

      await expect(
        service.register({ email: 'a@b.com', password: 'pass123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('throws ConflictException on DB unique constraint violation (race condition)', async () => {
      const pgUniqueError = Object.assign(new Error('unique violation'), { code: '23505' });
      mockDb.query
        .mockResolvedValueOnce({ rows: [] })
        .mockRejectedValueOnce(pgUniqueError);

      await expect(
        service.register({ email: 'race@b.com', password: 'pass123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('rethrows unknown DB errors as InternalServerErrorException', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [] })
        .mockRejectedValueOnce(new Error('unexpected db error'));

      await expect(
        service.register({ email: 'err@b.com', password: 'pass123' }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('creates user and returns token when email is new', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: 99, email: 'new@b.com', created_at: new Date() }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await service.register({ email: 'new@b.com', password: 'pass123' });

      expect(result.user.email).toBe('new@b.com');
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: 99, email: 'new@b.com' },
        expect.any(String),
        { expiresIn: '7d' },
      );
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when user not found', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        service.login({ email: 'x@y.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      const realHash = await bcrypt.hash('correct-password', 10);
      mockDb.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'x@y.com', password_hash: realHash, created_at: new Date() }],
      });

      await expect(
        service.login({ email: 'x@y.com', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
