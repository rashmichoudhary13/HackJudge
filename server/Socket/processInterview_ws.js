import ai from "../config/gemini.js";

export const initializeChat = (project, config, conversation) => {
    // Build system instruction
    const systemInstruction = `
        ## Role

        You are an experienced Hackathon Judge conducting an ongoing hackathon interview.

        Your judging focus:
        ${config.roleFocus}

        Your questioning style:
        ${config.questionStyle}

        ## Task

        You are evaluating a candidate's project. The project details and any supporting document have been provided in the initial user message.
        - Use the structured project information as the primary context. 
        - Analyze the supporting document to gather additional technical insights such as architecture, workflows, design decisions, implementation details, diagrams, and future enhancements. 
        - Use conversation history to analyze the candidate answer.
        Use all three sources together to generate relevant judging questions. Do not ask questions based on assumptions or invent details that are not present.

        Ask the questions on these criteria and also follow this evaluation priority in order:

        Your primary evaluation criteria:
           ${config.primaryCriteria.join("\n")}

        Your secondary evaluation criteria:
           ${config.secondaryCriteria.join("\n")}

        Spend approximately 80% of your questions evaluating the primary criteria.

        Use the secondary criteria only if important information is missing or if there is sufficient interview time.

        Do not spend too much time on a single criterion.

        For each criterion:
        - Ask one primary question.
        - Ask at most two follow-up questions only if they are likely to reveal additional understanding.
        - If the candidate still cannot answer adequately after two attempts, accept that the criterion has been sufficiently assessed and continue to the next criterion.

        It is more important to cover all judging criteria than to fully explore one topic.
                
        ## QUESTION STYLE RULES (VERY IMPORTANT)

        - Ask questions in simple, spoken English (like a real interviewer)
        - Use simple words (avoid complex vocabulary or academic tone)
        - Do NOT combine multiple questions into one
        - Do NOT use long introductions or background descriptions
        - Do not ask essay-type questions. Keep each question short, clear, and to the point.
        - If the question is long, shorten it before asking.

        ## GOOD EXAMPLES:
        - "How did you decide to use LGBMRanker for this problem?"
        - "What happens if your API data is outdated?"
        - "How does your system find new business opportunities?"

        ## Instructions

        * Behave like a professional hackathon judge.
        * Use the conversation history to avoid repeating questions.
        * Ask only one question at a time.
    `;

    // Reconstruct history
    const history = [];

    // The very first message in the chat history provides the project details and PDF deck
    const firstUserParts = [
        {
            text: `Here are the details of my hackathon project for your evaluation:
            * Project Title: ${project.Title}
            * Problem Statement: ${project.ProblemStatement}
            * Project Description: ${project.Description}
            * Tech Stack: ${project.TechStack}
            * Features: ${project.Feature}`
        }
    ];

    if (project.fileUri) {
        firstUserParts.unshift({
            fileData: {
                fileUri: project.fileUri,
                mimeType: "application/pdf",
            }
        });
    }

    history.push({
        role: 'user',
        parts: firstUserParts
    });

    // Append conversation turns
    for (let i = 0; i < conversation.length; i++) {
        const turn = conversation[i];

        // Add the model's question
        history.push({
            role: 'model',
            parts: [{ text: turn.judgeQuestion }]
        });

        // Add the user's answer (if it has been answered)
        if (turn.candidateAnswer !== "") {
            history.push({
                role: 'user',
                parts: [{ text: turn.candidateAnswer }]
            });
        }
    }

    return ai.chats.create({
        model: process.env.GEMINI_MODEL,
        config: {
            systemInstruction: systemInstruction,
        },
        history: history
    });
};

export const generateNextQuestion = async (chatSession, answer) => {
    const MAX_RETRY = 3;
    let resultText = "";

    for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
        try {
            console.time('generating content');
            const response = await chatSession.sendMessage({
                message: answer,
            });
            console.timeEnd('generating content');
            resultText = response.text;
            break;
        } catch (err) {
            console.log("Generating next question error: ", err);
            const code = err.error?.code;
            const retryable = code === 503 || code === 429;

            if (!retryable || attempt === MAX_RETRY) {
                throw err;
            }

            const delay = Math.pow(2, attempt - 1) * 1000;
            console.log(`Attempt ${attempt} failed. Retrying in ${delay} ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return resultText;
};
