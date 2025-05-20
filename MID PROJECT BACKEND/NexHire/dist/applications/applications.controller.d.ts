import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
export declare class ApplicationsController {
    private applicationsService;
    constructor(applicationsService: ApplicationsService);
    findByCandidate(req: any): Promise<import("./entities/application.entity").Application[]>;
    updateStatus(updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<import("./entities/application.entity").Application>;
}
