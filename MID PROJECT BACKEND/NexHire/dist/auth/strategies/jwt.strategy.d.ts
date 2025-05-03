import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { BlacklistedToken } from '../entities/blacklisted-token.entity';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private blacklistedTokenRepository;
    constructor(configService: ConfigService, blacklistedTokenRepository: Repository<BlacklistedToken>);
    validate(req: any, payload: any): Promise<{
        id: any;
        email: any;
        role: any;
    }>;
}
export {};
