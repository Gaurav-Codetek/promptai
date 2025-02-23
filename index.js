import axios from "axios";
import * as cheerio from "cheerio";
import nodemailer from "nodemailer";
import { URLSearchParams } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";



const SMTP_SERVER = "smtp.gmail.com";
const SMTP_PORT = 587;

// Scrape content from a given URL
async function scrapeParagraphContent(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let paragraphContent = "";
    $("p").each((i, el) => {
      paragraphContent += $(el).text().trim() + "\n";
    });
    return paragraphContent;
  } catch (error) {
    return `An error occurred: ${error.message}`;
  }
}

// Parse the AI-generated content
function parseContent(content, category) {
  const titleMatch = content.match(/\*(.*?)\*/);
  const parsedTitle = titleMatch ? titleMatch[1].trim() : "Untitled";

  const tagMatch = content.match(/\*\*\*\*(.*?)\*\*\*\*/);
  const parsedTag = tagMatch ? tagMatch[1].trim() : "No tags formed";

  const sectionsRegex = /\*\*(.*?)\*\*\s*\*\*\*(.*?)\*\*\*/g;
  const parsedSections = [];
  let match;
  while ((match = sectionsRegex.exec(content)) !== null) {
    parsedSections.push({
      subtitle: match[1].trim(),
      paragraph: match[2].trim(),
    });
  }

  return {
    title: parsedTitle,
    tag: parsedTag,
    category,
    date: new Date().toISOString().split("T")[0],
    content: parsedSections,
  };
}

// Generate AI-powered content
export async function generateContent(title, category, link, apiKey) {
  try {
    const genAI = new GoogleGenerativeAI(`${apiKey}`);
    const refer = await scrapeParagraphContent(link);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are a newsletter generating AI. Keep title within * symbol, subtitles within ** symbol, and paragraphs within *** symbol, and keep tags within two **** symbol and each tag must separate with a comma. generate newsletter taking reference from here: ${refer} and keep the title relative to user input and refernce data provided`,
    });
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${title}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      },
    });

    const result = parseContent(response.response.text(), category);
    return result;
  } catch (error) {
    return {
      status: 203,
      message: "Content not generated",
      reason: error,
    };
  }
}

// Send an email using Nodemailer
export async function sendEmail(
  receiverEmail,
  senderEmail,
  emailAppPassword,
  link,
  title,
  description,
  subject
) {
  try {
    let transporter = nodemailer.createTransport({
      host: SMTP_SERVER,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: senderEmail,
        pass: emailAppPassword,
      },
    });

    let htmlBody = `
       <html>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
                    
                    <!-- Header Section -->
                    <h2 style="text-align: center; color: #333; font-weight: 700; font-size: 24px;">📰 NewsletterAI</h2>
                    <p style="text-align: center; font-size: 14px; color: #555;">An AI-generated accurate & informative newsletter</p>
                    <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
                    <!-- Main Content Section -->
                    <div style="text-align: center;">
                        <a href="${link}" style="text-decoration: none; color: #007BFF;">
                            <h3 style="margin: 10px 0; color: #007BFF; font-size: 20px; text-decoration: underline;">${title}</h3>
                        </a>
                        <p style="font-size: 16px; color: #333; line-height: 1.6; padding: 0 15px;">${description}</p>
                    </div>
                    <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
                    <!-- Footer Section -->
                    <div style="text-align: center; font-size: 12px; color: gray;">
                        <p>If you did not subscribe, please ignore this email.</p>
                        <p style="font-size: 10px;">You received this email because you signed up for the AI-powered newsletter. <br>If you'd like to unsubscribe, click <a href="#" style="color: #007BFF;">here</a>.</p>
                    </div>
                </div>
            </body>
        </html>
        `;

    let mailOptions = {
      from: senderEmail,
      to: receiverEmail,
      subject,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions)
    return { status: 200, message: "Email sent successfully" };
  } catch (error) {
    return {
      status: 203,
      message: "Error in sending mail",
      reason: error.message,
    };
  }
}

// Create a blog page link
export function createBlogPage(title, domainType, domainName) {
  const encodedTitle = new URLSearchParams({ title }).toString();
  if (domainType === "local") {
    return {
      status: 200,
      message: "Link generated",
      link: `http://${domainName}/?${encodedTitle}`,
    };
  } else if (domainType === "live") {
    return {
      status: 200,
      message: "Link generated",
      link: `https://${domainName}/?${encodedTitle}`,
    };
  } else {
    return {
      status: 203,
      message: "Error generating link",
      reason: "Domain type not specified",
    };
  }
}
