import * as fs from 'fs';
import * as path from 'path';

interface NewsletterTemplateData {
    title?: string;
    description?: string;
    subheading?: string;
    newsletterId?: string;
    websiteUrl?: string;
}

class EmailTemplateService {
    private templatePath: string;

    constructor() {
        this.templatePath = path.join(process.cwd(), 'src', 'email-templates', 'newsletter', 'index.html');
    }

    /**
     * Read and process newsletter HTML template with dynamic data
     */
    async getNewsletterTemplate(data: NewsletterTemplateData): Promise<string> {
        try {
            console.log('Reading template from:', this.templatePath);
            const template = fs.readFileSync(this.templatePath, 'utf8');
            console.log('Template loaded successfully, length:', template.length);

            // Replace placeholders with actual data
            let processedTemplate = template
                .replace(/NEWSLETTER HEADER/g, data.title || 'Newsletter')
                .replace(/newsletter subheading goes here/g, data.subheading || 'Check out our latest updates')
                .replace(/Newsletter description/g, data.description || 'Discover the latest news and updates')
                .replace(/www\.example\.com/g, data.websiteUrl || 'https://aimsintel.com')
                .replace(/This weeks updated intel!/g, data.subheading || 'This weeks updated intel!');

            // Update image paths to use absolute URLs for email compatibility
            processedTemplate = processedTemplate.replace(
                /src="images\//g,
                'src="https://aimsintel.com/email-templates/newsletter/images/'
            );

            // Also update background image URL
            processedTemplate = processedTemplate.replace(
                /url\('images\//g,
                'url(\'https://aimsintel.com/email-templates/newsletter/images/'
            );

            console.log('Template processed successfully');
            return processedTemplate;
        } catch (error) {
            console.error('Error reading newsletter template:', error);
            console.error('Template path:', this.templatePath);
            console.error('Error details:', error);
            throw new Error('Failed to load newsletter template');
        }
    }

    /**
     * Get the absolute path to template images directory
     */
    getImagesPath(): string {
        return path.join(process.cwd(), 'src', 'email-templates', 'newsletter', 'images');
    }
}

const emailTemplateService = new EmailTemplateService();
export default emailTemplateService;