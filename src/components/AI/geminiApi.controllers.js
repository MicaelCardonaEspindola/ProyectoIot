import { GoogleGenAI } from "@google/genai";
import axios, { formToJSON } from "axios";
import fs from "fs";
import path from "path";

export const getModelGemini = async (req, res) => {
  try {
    const { apiKey } = req.params;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await axios.get(url);
    
    const imageModels = response.data.models.filter(model => 
      model.supportedGenerationMethods.includes("generateContent")
    );

    res.status(200).json(imageModels); 
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({ error: "Failed to retrieve models" });
  }
};

export const postImgToHtml = async (req, res) => {
    try {
      const { apiKey } = req.params;
      console.log(req.file)
      // Check if image was uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }
      
      // Check supported image formats
      const supportedFormats = ['image/jpeg', 'image/png'];
      if (!supportedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          error: "Unsupported image format. Please upload JPG or PNG images only." 
        });
      }
      
      // Read uploaded file as base64
      const filePath = req.file.path;
      const base64Image = fs.readFileSync(filePath, { encoding: "base64" });
      
      // Initialize Gemini API with provided key
      const ai = new GoogleGenAI({ apiKey });
      
      // Create prompt based on image content type analysis
      const contents = [
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image,
          },
        },
        { 
          text: "First determine if this image shows a webpage design, " +
        "a webpage drawing/sketch, or a class diagram/UML. " +
        
        "If it's a webpage design, provide ONLY the complete HTML code with Tailwind CSS classes " +
        "that would recreate this webpage design with proper responsive behavior. " +
        
        "If it's a webpage drawing/sketch, provide ONLY the production-ready HTML code with Tailwind CSS " +
        "that transforms this sketch into a professional layout. Pay special attention to: " +
        "- Convert drawn rectangles to appropriate semantic HTML5 tags (nav, header, main, section, article, aside, footer) " +
        "- Use proper spacing with Tailwind's padding/margin utilities (p-4, my-8, etc.) " +
        "- Implement responsive design with Tailwind's breakpoint classes (sm:, md:, lg:) " +
        "- Create professional typography with proper font sizes, weights and spacing " +
        "- Maintain proper alignment and proportion from the sketch " +
        "- Add subtle professional touches like shadows, rounded corners, and transitions where appropriate " +
        "- Use a complementary color scheme based on any color hints in the sketch " +
        "Include NOTHING but the HTML/Tailwind code. " +
        
        "If it's a class diagram or UML, provide ONLY the HTML and Tailwind CSS code that would " +
        "visually represent this diagram with clean box styling, proper connecting lines, and clear typography. " +
        
        "Return ONLY the complete HTML code with no explanations, introductions, or any other text."
        },
      ];
      
      // Generate content with Gemini
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
      });
      
      // Clean up the uploaded file
      fs.unlinkSync(filePath);
      
      // Send only the HTML response
      res.send(response.text);
      
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ error: "Failed to process image", details: error.message });
    }
  }



  /**************************************************************************************** */

  // Función 1: Limpieza de datos con IA
export const cleanDataWithAI = async (apiKey,rawData) => {
  try {

   if (!rawData || typeof rawData !== 'string') {
      return "Please provide rawData as a string.";
    }

    if (!apiKey) {
      return "API key is required.";
    }


    const ai = new GoogleGenAI({ apiKey });

    const cleaningPrompt = `You are a data processing expert. Clean and optimize the following energy and maintenance data for dashboard visualization.

**YOUR TASK:**
Transform the raw data into a clean, structured format optimized for dashboard creation.

**CLEANING RULES:**
1. **Energy Data Processing:**
   - Parse timestamps to ISO format
   - Convert consumption values to numbers
   - Calculate KPIs: current, average, max, min consumption
   - Group consumption by hour of day
   - Identify trends and patterns

2. **Maintenance Data Processing:**
   - Extract sensor readings and convert to proper numbers
   - Calculate health percentages and failure probabilities
   - Identify active alerts and recommendations
   - Process equipment diagnostics

3. **Data Quality Assessment:**
   - Count total valid records
   - Identify missing or invalid data
   - Rate data quality (good/limited/poor)

4. **Alert Generation:**
   - Create alerts for low health (<50%)
   - Create alerts for high failure probability (>70%)
   - Process existing diagnostic alerts
   - Assign severity levels (critical/warning/info)

**OUTPUT FORMAT:**
Return ONLY a clean JSON object with this structure:
{
  "metadata": {
    "processedAt": "ISO timestamp",
    "dataQuality": "good|limited|poor",
    "totalRecords": number,
    "hasEnergyData": boolean,
    "hasMaintenanceData": boolean
  },
  "kpis": {
    "currentConsumption": number,
    "averageConsumption": number,
    "predictedConsumption": number,
    "healthPercentage": number,
    "failureProbability": number,
    "remainingLifeDays": number
  },
  "charts": {
    "energyTimeSeries": [{"timestamp": "ISO", "consumption": number, "temperature": number}],
    "hourlyConsumption": [{"hour": number, "avgConsumption": number}],
    "temperatureCorrelation": [{"temperature": number, "consumption": number}]
  },
  "maintenance": {
    "assetId": "string",
    "sensors": {
      "vibration": number,
      "motorTemp": number,
      "pressure": number,
      "electricCurrent": number,
      "operatingHours": number
    },
    "lastUpdate": "ISO timestamp"
  },
  "alerts": [
    {
      "type": "maintenance|health|failure|energy",
      "severity": "critical|warning|info",
      "code": "string",
      "message": "string",
      "recommendation": "string",
      "timestamp": "ISO timestamp"
    }
  ]
}

**IMPORTANT:**
- Return ONLY valid JSON (no markdown, no explanations)
- Handle missing data gracefully (use 0 or null)
- All numbers must be valid (no NaN or undefined)
- All timestamps must be valid ISO strings
- Calculate derived metrics where possible
- Remove duplicate or invalid entries

**RAW DATA TO CLEAN:**
${JSON.stringify(rawData, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: cleaningPrompt }],
    });

    let generatedText = response.text;
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let cleanedData;
    try {
      cleanedData = JSON.parse(generatedText);
    } catch (parseError) {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedData = JSON.parse(jsonMatch[0]);
      } else {
      console.error("Error cleaning data:", error);
      }
    }

   console.log(cleanedData)

    return JSON.stringify(cleanedData);



  } catch (error) {
    console.error("Error cleaning data:", error);
  }
};

export const generateEnergyDashboard = async (req, res) => {
  try {
    const { apiKey } = req.params;
    const { rawData } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "API key is required." });
    }

    const cleanedData = await cleanDataWithAI(apiKey, rawData);

    const ai = new GoogleGenAI({ apiKey });

const dashboardPrompt = `You are a React + Tailwind developer. Create a PROFESSIONAL energy dashboard for executives.

**REQUIREMENTS:**
- **Theme**: Light theme - bg-white, bg-gray-50 for cards, text-gray-800
- **Colors**: Use blue-600, green-600, amber-500, red-600 for charts and status
- **Charts**: Use Apache ECharts (already installed) - create Line, Bar, and Doughnut charts
- **Layout**: Professional grid layout, clean and minimal

**STRUCTURE:**
1. Clean header with "Energy Dashboard" title
2. 4 KPI metric cards (consumption, efficiency, cost, alerts)
3. 3 charts section: Line chart (trends), Bar chart (comparison), Doughnut chart (distribution)
4. Compact status/alerts panel

**CHART IMPLEMENTATION:**
- Use ReactECharts component: <ReactECharts option={chartOption} style={{height: '300px'}} />
- Create proper ECharts options with the provided data
- Style charts with light theme colors
- Make charts responsive

**CODE RULES:**
- Clean, professional JSX
- Use Tailwind utilities only
- Keep code concise but functional
- Responsive grid system
- Professional typography

**DATA TO VISUALIZE:**
${JSON.stringify(cleanedData, null, 2)}

**OUTPUT:**
Return ONLY the JSX content that goes INSIDE the return statement.
- Start directly with the opening <div> tag
- End with the closing </div> tag
- NO "return (" at the beginning
- NO ");" at the end
- Just the pure JSX content inside the return
- Include chart configurations and options

Example format:
<div className="min-h-screen bg-white">
  {/* Dashboard content here */}
</div>`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: dashboardPrompt }],
    });

    const generatedText =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanedJSX = generatedText
      .replace(/```(jsx|tsx)?/g, "")
      .trim();


console.log(cleanedJSX)
    return res.json({
      jsx: cleanedJSX
    });

  } catch (error) {
    console.error("Error generating dashboard JSX:", error);
    res.status(500).json({
      error: "Failed to generate dashboard JSX",
      details: error.message
    });
  }
};



/* Generar texto para voz desde datos */

export const rawDataToText = async (req, res) => {
  try {
    const { apiKey } = req.params;
    const { rawData } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "API key is required." });
    }

    if (!rawData || typeof rawData !== 'string') {
      return res.status(400).json({ error: "Please provide rawData as a string." });
    }

    const ai = new GoogleGenAI({ apiKey });

    const analystPrompt = `You are a professional Spanish you talk in spanish energy data analyst presenting to high-level executives.

**OBJECTIVE:** Generate a clear and professional executive summary (2–4 short paragraphs) as if presenting verbally during a board meeting.

**PRESENTATION STYLE:**
- Professional yet natural tone, like an expert consultant
- Addressed to non-technical executives
- Focus on business impact, operational efficiency, cost trends, and risks
- Include observations on patterns, anomalies, alerts, and strategic recommendations
- Use executive-friendly language such as "financial impact", "optimization", "operational efficiency"

**REGLAS TÉCNICAS IMPORTANTES:**
- **SIEMPRE expandir abreviaciones en espaniol**: 
  • KWH → Kilovatio Hora
  • MW → Megavatio
  • KW → Kilovatio  
  • HVAC → Sistema de Calefacción, Ventilación y Aire Acondicionado
  • RPM → Revoluciones Por Minuto
  • PSI → Libras por Pulgada Cuadrada
  • BTU → Unidad Térmica Británica
- Explain technical terms in business-relevant terms
- NUNCA AGREGAR ABREVIACIONES
- Mention financial implications when relevant

**STRUCTURE:**
1. General summary of the energy performance
2. Key findings and significant metrics  
3. Risks, opportunities, or actionable recommendations
4. Professional closing appropriate for executive communication

**OUTPUT FORMAT:**
- Only plain narrative text in English
- NO JSON, NO code, NO explanation of the process
- Spanish output this is mandatory
- Close with something like: "Gracias por su atencion" or "Muchas gracias por su tiempo"
**
${rawData}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: analystPrompt }],
    });

    const message = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;

    if (!message) {
      return res.status(500).json({
        error: "AI failed to generate executive summary.",
        rawResponse: response,
      });
    }

    // Convertir texto a audio
    const audioBuffer = await textToAudio(message);
    
    if (typeof audioBuffer === 'string') {
      // Si textToAudio retorna un string, es un error
      return res.status(500).json({
        error: "Failed to convert text to audio",
        details: audioBuffer
      });
    }

    // Crear directorio de uploads si no existe
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generar nombre único para el archivo de audio
    const timestamp = Date.now();
    const fileName = `audio_${timestamp}.mp3`;
    const filePath = path.join(uploadsDir, fileName);

    // Guardar el archivo de audio
    fs.writeFileSync(filePath, audioBuffer);

    // Enviar el archivo de audio como respuesta
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Eliminar el archivo después de enviarlo
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
      });
    });

  } catch (error) {
    console.error("Error generating executive summary:", error);
    res.status(500).json({
      error: "Failed to generate executive summary",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

export const textToAudio = async (text) => {
  try {
    // Validar que se proporcione texto
    if (!text) {
      return "Text is required";
    }

    // Configurar la petición a ElevenLabs
    const options = {
      method: 'POST',
      url: 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', // Voz por defecto
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.SECRET_KEY_ELEVEN
      },
      data: {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      responseType: 'arraybuffer'
    };

    // Realizar la petición a ElevenLabs
    const response = await axios(options);

    // Retornar el buffer de audio
    return response.data;

  } catch (error) {
    console.error("Error converting text to audio:", error);
    
    if (error.response) {
      // Error de la API de ElevenLabs
      const statusCode = error.response.status;
      let errorMessage = "Failed to convert text to audio";
      
      switch (statusCode) {
        case 401:
          errorMessage = "Invalid API key";
          break;
        case 400:
          errorMessage = "Invalid request parameters";
          break;
        case 422:
          errorMessage = "Invalid text or voice settings";
          break;
        case 429:
          errorMessage = "Rate limit exceeded";
          break;
        default:
          errorMessage = `ElevenLabs API error: ${statusCode}`;
      }
      
      return errorMessage;
    }
    
    return "Internal server error";
  }
};