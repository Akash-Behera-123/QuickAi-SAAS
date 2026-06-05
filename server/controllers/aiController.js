import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";




const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== "premium" && free_usage >= 100) {
            return res.json({
                success: false,
                message: "Limit reached. Upgrade to continue."
            });
        }

        // const response = await AI.chat.completions.create({
        //     model: "gemini-2.5-flash",
        //     messages: [
        //         {
        //             role: "user",
        //             content: prompt,
        //         },
        //     ],
        //     temperature: 0.7,
        //     max_tokens: length,
        // });
        
        const response = await AI.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
        {
            role: "user",
            content: `
    ${prompt}

    Requirements:
    - Write approximately ${length} words.
    - Include a title.
    - Include an introduction.
    - Include multiple headings and subheadings.
    - Include detailed explanations and examples.
    - Include a conclusion.
    - Do not generate a short summary.
    - Ensure the article is close to ${length} words.
     `,
        },
    ],
    temperature: 0.7,
    max_tokens: Math.ceil(length * 2),
    });
        


        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations(user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'article')
        `;

        if (plan !== "premium") {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: (free_usage || 0) + 1,
                },
            });
        }

        res.json({
            success: true,
            content,
        });

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== "premium" && free_usage >= 100) {
            return res.json({
                success: false,
                message: "Limit reached. Upgrade to continue."
            });
        }

        const response = await AI.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
        {
            role: "user",
           content: `
Topic: ${prompt}

Generate EXACTLY 10 blog titles.

IMPORTANT:
- Return exactly 10 titles.
- Each title must be on a new line.
- Prefix each title with a number (1. to 10.).
- No introductory text.
- No explanations.
- No notes.
- No markdown formatting.
- No blank lines.

Example:

1. First Title
2. Second Title
3. Third Title
4. Fourth Title
5. Fifth Title
6. Sixth Title
7. Seventh Title
8. Eighth Title
9. Ninth Title
10. Tenth Title
`
        }
    ],
    temperature: 0.9,
    max_tokens: 1000,
});

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations(user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
        `;

        if (plan !== "premium") {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: (free_usage || 0) + 1,
                },
            });
        }

        res.json({
            success: true,
            content,
        });

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message,
        });
    }
};




export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== "premium") {
            return res.json({
                success: false,
                message: "This feature is only available for premium subscriptions"
            });
        }
        
        const formData = new FormData()
        formData.append('prompt', prompt)

        const {data}=await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
            headers:{'x-api-key': process.env.CLIPDROP_API_KEY,},
            responseType:"arraybuffer",
        })
        
        const base64Image= `data:image/png;base64,${Buffer.from(data,'binary').
            toString('base64')
        }`;
        
        const {secure_url}=await cloudinary.uploader.upload(base64Image)

        

        await sql`
            INSERT INTO creations(user_id, prompt, content, type,publish)
            VALUES (${userId}, ${prompt}, ${secure_url}, 'image',${publish ?? false})
        `;


        res.json({
            success: true,
            content: secure_url
        });

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message,
        });
    }
};




export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        if (plan !== "premium") {
            return res.json({
                success: false,
                message: "This feature is only available for premium subscriptions"
            });
        }

        if (!image) {
            return res.json({
                success: false,
                message: "No image uploaded"
            });
        }

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: "background_removal"
                }
            ]
        });

        await sql`
            INSERT INTO creations(user_id, prompt, content, type)
            VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
        `;

        res.json({
            success: true,
            content: secure_url
        });

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message,
        });
    }
};








// export const removeImageBackground = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const {image} = req.file;
//         const plan = req.plan;

//         if (plan !== "premium") {
//             return res.json({
//                 success: false,
//                 message: "This feature is only available for premium subscriptions"
//             });
//         }
        
//         const {secure_url}=await cloudinary.uploader.upload(image.path,{
//             transformation: [
//                 {
//                     effect: "background_removal",
//                     background_removal:'remove_the_background'
//                 }
//             ]
//         })
        

//         await sql`
//             INSERT INTO creations(user_id, prompt, content, type)
//             VALUES (${userId},'Remove background from image', ${secure_url}, 'image')
//         `;


//         res.json({
//             success: true,
//             content: secure_url
//         });

//     } catch (error) {
//         console.log(error.message);

//         res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// };








// export const removeImageObject = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { object } = req.body;
//         const {image} = req.file;
//         const plan = req.plan;

//         if (plan !== "premium") {
//             return res.json({
//                 success: false,
//                 message: "This feature is only available for premium subscriptions"
//             });
//         }
        
//         const {public_id}=await cloudinary.uploader.upload(image.path)

//         const imageUrl = cloudinary.url(public_id,{
//             transformation:[{effect: `gen_remove:${object}`}],
//             resource_type:'image'
//         })
        

//         await sql`
//             INSERT INTO creations(user_id, prompt, content, type)
//             VALUES (${userId},${`Removed ${object} from image`}, ${imageUrl}, 'image')
//         `;


//         res.json({
//             success: true,
//             content: imageUrl
//         });

//     } catch (error) {
//         console.log(error.message);

//         res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// };






export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (plan !== "premium") {
            return res.json({
                success: false,
                message: "This feature is only available for premium subscriptions"
            });
        }

        if (!image) {
            return res.json({
                success: false,
                message: "No image uploaded"
            });
        }

        const { public_id } = await cloudinary.uploader.upload(image.path);

        const imageUrl = cloudinary.url(public_id, {
            transformation: [
                {
                   effect: "gen_remove"
                }
            ],
            resource_type: "image"
        });

        await sql`
            INSERT INTO creations(user_id, prompt, content, type)
            VALUES (
                ${userId},
                ${`Removed ${object} from image`},
                ${imageUrl},
                'image'
            )
        `;

        res.json({
            success: true,
            content: imageUrl
        });

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message,
        });
    }
};






import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const resumeReview = async (req, res) => {
    try {
        const resume = req.file;

        if (!resume) {
            return res.json({ success: false, message: "No resume uploaded" });
        }

        const data = new Uint8Array(fs.readFileSync(resume.path));

        const pdf = await pdfjsLib.getDocument({ data }).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ") + "\n";
        }

        const prompt = `Review this resume:\n\n${text}`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
        });

        const content = response.choices[0].message.content;

        res.json({ success: true, content });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};