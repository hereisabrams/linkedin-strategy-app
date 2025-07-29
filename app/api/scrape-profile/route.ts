
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {


    try {
        const { url } = await request.json();

        if (!url || !url.includes('linkedin.com/in/')) {
            return NextResponse.json({ error: "A valid LinkedIn profile URL is required." }, { status: 400 });
        }

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the main profile section to load to ensure content is available
        await page.waitForSelector('main', { timeout: 10000 });
        
        const scrapedData = await page.evaluate(() => {
            const name = (document.querySelector('h1') as HTMLElement)?.innerText?.trim() || '';
            const headline = (document.querySelector('.text-body-medium.break-words') as HTMLElement)?.innerText?.trim() || '';
            
            let about = '';
            // Find the "About" section by its heading
            const allH2s = Array.from(document.querySelectorAll('h2'));
            const aboutH2 = allH2s.find(h2 => (h2 as HTMLElement).innerText.trim().toLowerCase() === 'about');
            
            if (aboutH2) {
                // This structure depends on LinkedIn's current layout. It traverses up to a common parent section.
                const parentSection = aboutH2.closest('section');
                if (parentSection) {
                    // Try to find the container with the full text, accounting for "see more"
                    // This selector combines a few common patterns.
                    const textContainer = parentSection.querySelector('.inline-show-more-text, .pv-about__summary-text, p');
                    if (textContainer) {
                        about = (textContainer as HTMLElement).innerText.trim();
                    }
                }
            }

            if (!about) {
                // A simpler fallback if the main method fails
                const aboutSectionDiv = Array.from(document.querySelectorAll('div.pv-about-section'))[0] as HTMLElement;
                if(aboutSectionDiv) {
                    about = aboutSectionDiv.innerText.trim();
                }
            }
            
            return { name, headline, about };
        });

        await browser.close();

        if (!scrapedData.about) {
             return NextResponse.json({ error: "Could not find the 'About' section. Please ensure the profile is public and has an 'About' section. This tool may not work on private profiles." }, { status: 404 });
        }

        return NextResponse.json(scrapedData);

    } catch (error: any) {
        console.error("Error in scraping API:", error);
        let message = "Failed to scrape LinkedIn profile.";
        if (error.name === 'TimeoutError') {
            message = "The page took too long to load. This might be due to a private profile, a login wall, or network issues.";
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
