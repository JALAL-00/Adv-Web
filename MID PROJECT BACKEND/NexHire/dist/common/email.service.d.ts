export declare class EmailService {
    private transporter;
    constructor();
    sendMail(to: string, subject: string, text: string): Promise<void>;
    sendNewProjectNotification(to: string, project: {
        title: string;
        description: string;
        requiredSkills: string[];
    }): Promise<void>;
    sendApplicationUpdateNotification(to: string, projectTitle: string, status: string, isOwner: boolean): Promise<void>;
}
