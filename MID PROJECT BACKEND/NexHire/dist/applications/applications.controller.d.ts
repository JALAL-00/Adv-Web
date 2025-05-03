import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    apply(createApplicationDto: CreateApplicationDto, req: any): void;
    findByCandidate(req: any): Promise<import("./entities/application.entity").Application[]>;
}
