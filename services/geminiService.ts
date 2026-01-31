
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WordData, PolyglotInsight, MeaningShift, JournalAnalysis, Collection, PronunciationResult, CreativePrompt, CreativeCritique, LinguisticTrivia } from '../types';

// Helper to check for quota issues
const isQuotaError = (error: any) => {
  const msg = error?.message || '';
  return error?.status === 429 || error?.code === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
};

// Fallback data for when API limits are reached
const FALLBACK_TRIVIA_LIST: LinguisticTrivia[] = [
  {
    title: "Unutulmuş Harf",
    fact: "Ampersand (&) sembolü eskiden alfabenin 27. harfiydi ve Latince 've' anlamına gelen 'et' kelimesinin ligatürüdür.",
    connection: "Latince -> Tipografi",
    iconType: 'HISTORY'
  },
  {
    title: "Hayalet Kelime",
    fact: "'Dord' kelimesi, bir editörün 'D or d' (yoğunluk için kısaltma) notunu yanlış okuması sonucu 1934'te Webster sözlüğüne yanlışlıkla girmiştir.",
    connection: "Sözlük Hatası",
    iconType: 'MAGIC'
  },
  {
    title: "En Eski Ses",
    fact: "'Anne' ve 'Baba' kelimeleri, bebeklerin çıkarabildiği en kolay sesler olduğu için (dudak sesleri) dünya dillerinin çoğunda benzerdir.",
    connection: "Evrensel Dilbilim",
    iconType: 'SCIENCE'
  }
];

export const getGeminiDefinition = async (word: string): Promise<WordData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemPrompt = `Sen Lexicon'sun, akademik düzeyde bir Türkçe-İngilizce sözlük motorusun. Yanıtlarını her zaman katı JSON formatında döndür. İstenen alanlar için veri bulamazsan, boş string ("") veya boş dizi ([]) kullan.`;
  
  const userPrompt = `"${word}" kelimesini analiz et.
  1. Kelimenin Türkçe mi yoksa İngilizce mi olduğunu belirle.
  2. İngilizce ise: Birincil Türkçe çevirisini, fonetik transkripsiyonunu, kelime türünü, İngilizce tanımlarını, İngilizce örnek cümlelerini ve detaylı etimolojisini sağla.
  3. Türkçe ise: Birincil İngilizce çevirisini, kelime türünü, Türkçe bir tanımını ve içinde geçtiği Türkçe bir örnek cümleyi sağla. Türkçe kelimeler için fonetik ve etimoloji gerekli değildir.
  Tüm metinler (tanımlar, örnekler) kendi dilinde olmalıdır.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            translation: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            definitions: { type: Type.ARRAY, items: { type: Type.STRING } },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            etymology: { type: Type.STRING },
          },
          required: ["word", "translation", "phonetic", "partOfSpeech", "definitions", "examples", "etymology"]
        }
      }
    });

    let text = response.text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
    return JSON.parse(text) as WordData;
  } catch (error) {
    console.error("Gemini API Error (Definition):", error);
    return getMockDefinition(word);
  }
};

export const analyzeJournalEntry = async (content: string, word: string): Promise<JournalAnalysis | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `"${word}" kelimesi hakkındaki bu günlük girişini analiz et. İçerik: "${content}". Yazım tarzını, kelime dağarcığını ve düşünce derinliğini Türkçe olarak eleştir.`,
      config: {
        systemInstruction: "Sen bir edebiyat eleştirmenisin. Yapıcı, akademik geri bildirimleri Türkçe ver. 0-100 arasında bir belagat puanı ata.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eloquenceScore: { type: Type.INTEGER },
            tone: { type: Type.STRING },
            vocabularyRichness: { type: Type.STRING },
            critique: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["eloquenceScore", "tone", "vocabularyRichness", "critique", "suggestion"]
        }
      }
    });
    return JSON.parse(response.text) as JournalAnalysis;
  } catch (error) {
    console.error("Journal Analysis Error:", error);
    return {
        eloquenceScore: 85,
        tone: "Düşünceli",
        vocabularyRichness: "Orta",
        critique: "Bağlantı sınırları nedeniyle yapay zeka analizi şu anda yapılamıyor, ancak çabanız takdire şayan.",
        suggestion: "Yazmaya devam edin."
    };
  }
};

export const generateCustomCollection = async (theme: string, options?: { image?: string; color?: string }): Promise<Collection | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Şu temaya dayalı 3 sofistike, elit kelimeden oluşan küratörlü bir sözlük koleksiyonu oluştur: "${theme}". Her biri için tam veriyi Türkçe olarak sağla.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  phonetic: { type: Type.STRING },
                  partOfSpeech: { type: Type.STRING },
                  definitions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  examples: { type: Type.ARRAY, items: { type: Type.STRING } },
                  etymology: { type: Type.STRING },
                  register: { type: Type.STRING },
                  etymologyStages: { type: Type.ARRAY, items: { type: Type.STRING } },
                  synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  connotation: { type: Type.STRING },
                  idioms: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["word", "phonetic", "partOfSpeech", "definitions", "examples", "etymology", "register", "etymologyStages", "synonyms", "connotation", "idioms"]
              }
            }
          },
          required: ["title", "description", "words"]
        }
      }
    });
    
    const data = JSON.parse(response.text);
    return {
      id: `custom-${Date.now()}`,
      imageUrl: options?.image || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=2070", 
      themeColor: options?.color,
      isCustom: true,
      ...data
    };
  } catch (error) {
    console.error("Collection Gen Error:", error);
    return null;
  }
};

export const getPolyglotMirror = async (word: string): Promise<PolyglotInsight[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `"${word}" için Latince, Antik Yunanca, Fransızca veya Sanskritçe gibi dillerde 3-4 kökteş veya anlamsal olarak eşdeğer "elit" kelime sağla. Sofistike kelime dağarcığına odaklan. JSON nesneleri dizisi olarak döndür. Açıklamalar Türkçe olmalı.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              language: { type: Type.STRING },
              word: { type: Type.STRING },
              meaning: { type: Type.STRING },
              connotation: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text) as PolyglotInsight[];
  } catch (error) {
    return []; // Return empty array on error
  }
};

export const getEtymologicalChronology = async (word: string): Promise<MeaningShift[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `"${word}" kelimesinin anlamının veya kullanımının farklı dönemlerde (örneğin Klasik, Ortaçağ, Aydınlanma, Modern) nasıl değiştiğine dair bir kronoloji sağla. 3-4 nesne içeren bir JSON dizisi olarak döndür. Tüm metinler Türkçe olmalı.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              era: { type: Type.STRING },
              definition: { type: Type.STRING },
              context: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text) as MeaningShift[];
  } catch (error) {
    return []; // Return empty array on error
  }
};

export const getGeographicProvenance = async (word: string, lat?: number, lng?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use standard flash for better tool support
      contents: `"${word}" kelimesinin kökeni veya gelişimi açısından tarihsel veya kültürel olarak önemli olan Dünya üzerindeki 2-3 konumu belirle. Yanıtı Türkçe ver.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
          }
        }
      },
    });

    return {
      text: response.text,
      places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps Grounding Error (Fallback to Text):", error);
    try {
        const fallbackResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `"${word}" kelimesinin kökeni veya tarihsel gelişimi ile ilgili önemli coğrafi yerleri (şehirler, ülkeler) kısaca anlat. Türkçe cevap ver.`,
        });
        return { text: fallbackResponse.text, places: [] };
    } catch (fallbackError) {
        return { text: "Coğrafi veriye şu anda ulaşılamıyor.", places: [] };
    }
  }
};

export const getWordCitations = async (word: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `"${word}" kelimesinin kaliteli gazetecilik veya edebiyatta kullanılan 3 güncel örneğini bul. Cümleyi ve kaynağı sağla.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search Grounding Error (Fallback to GenAI):", error);
    try {
        const fallbackResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `"${word}" kelimesinin edebiyatta veya günlük kullanımda geçtiği 3 örnek cümle yaz. Kaynak belirtmek zorunda değilsin, sadece cümleleri Türkçe olarak listele.`,
        });
        return { text: fallbackResponse.text, sources: [] };
    } catch (fallbackError) {
        return { text: "Kaynaklar şu anda yüklenemiyor.", sources: [] };
    }
  }
};

export const getGeminiTTS = async (text: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    return null;
  }
};

export const generateWordImage = async (word: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ 
          text: `A minimalist, elegant, scholarly line-art illustration representing the essence of the word '${word}'. Black and white, fine lines, high aesthetic value, dictionary style.` 
        }] 
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getWordNuance = async (word: string, synonyms: string[]): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `"${word}" kelimesinin ince nüansını, özellikle "${synonyms.slice(0, 3).join(', ')}" ile karşılaştırarak Türkçe açıkla. Dil seviyesi ve duyguya odaklan. 60 kelimenin altında tut.`,
    });
    return response.text || null;
  } catch (error) {
    return "Nüans analizi şu anda kullanılamıyor.";
  }
};

export const getSemanticNeighbors = async (word: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `"${word}" kelimesine kavramsal veya anlamsal olarak yakın olan, ancak doğrudan eş anlamlısı OLMAYAN 4 kelime sağla. Bir akademisyenin ilgisini çekebilecek ilgili kavramlar olmalıdır. Sadece Türkçe karakter dizisi içeren bir JSON dizisi döndür.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    let text = response.text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
    return JSON.parse(text) as string[];
  } catch (error) {
    return [];
  }
};

export const analyzePronunciation = async (word: string, audioBase64: string): Promise<PronunciationResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
             text: `Kullanıcı "${word}" kelimesini telaffuz etmeye çalışıyor. Sesi analiz et ve telaffuz doğruluğunu puanla (0-100). Kullanıcının nasıl duyulduğunu (fonetik olarak) yaz ve Türkçe olarak 2-3 adet spesifik, fiziksel düzeltme tavsiyesi ver (örneğin: 'Dudaklarını büz', 'R harfini daha sert söyle'). Teşvik edici ol.`
          },
          {
            inlineData: {
              mimeType: "audio/webm;codecs=opus",
              data: audioBase64
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            phoneticAccuracy: { type: Type.STRING },
            detectedPhonemes: { type: Type.STRING },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            encouragement: { type: Type.STRING }
          },
          required: ["score", "phoneticAccuracy", "detectedPhonemes", "tips", "encouragement"]
        }
      }
    });
    return JSON.parse(response.text) as PronunciationResult;
  } catch (error) {
    console.error("Pronunciation Analysis Error:", error);
    return null;
  }
};

export const generateLinguisticTrivia = async (): Promise<LinguisticTrivia | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Bana etimoloji, dilbilim tarihi veya kelimeler arasındaki şaşırtıcı bağlantılar hakkında rastgele, "zihin açıcı" ve az bilinen bir gerçek söyle. Çok kısa, akademik ama ilgi çekici olsun. Türkçe yanıtla. Örnek: "Avokado kelimesi Aztekçe 'testis' anlamına gelen āhuacatl'dan gelir."`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Kısa, merak uyandırıcı başlık" },
            fact: { type: Type.STRING, description: "İlginç bilgi (max 2 cümle)" },
            connection: { type: Type.STRING, description: "Bağlantı özeti (örn: Latince -> Modern Türkçe)" },
            iconType: { type: Type.STRING, enum: ['HISTORY', 'MAGIC', 'SCIENCE'] }
          },
          required: ["title", "fact", "connection", "iconType"]
        }
      }
    });
    return JSON.parse(response.text) as LinguisticTrivia;
  } catch (error) {
    console.warn("Trivia Gen Error (Using Fallback):", error);
    return FALLBACK_TRIVIA_LIST[Math.floor(Math.random() * FALLBACK_TRIVIA_LIST.length)];
  }
};

export const generateCreativePrompt = async (style: string, availableWords: WordData[]): Promise<CreativePrompt | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const targetWord = availableWords.length > 0 
    ? availableWords[Math.floor(Math.random() * availableWords.length)].word 
    : "Serendipity";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Bana "${targetWord}" kelimesini kullanan, "${style}" tarzında bir yaratıcı yazarlık istemi (prompt) oluştur. İstem, kullanıcıya kısa bir sahne veya duygu tarif ettirmeli. Ayrıca zorlayıcı bir kısıtlama (constraint) ekle. Türkçe cevap ver.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            targetWord: { type: Type.STRING },
            style: { type: Type.STRING },
            scenario: { type: Type.STRING },
            constraint: { type: Type.STRING }
          },
          required: ["id", "targetWord", "style", "scenario", "constraint"]
        }
      }
    });
    return JSON.parse(response.text) as CreativePrompt;
  } catch (error) {
    console.error("Creative Prompt Gen Error:", error);
    return {
      id: 'fallback-prompt',
      targetWord: targetWord,
      style: style,
      scenario: "Yapay zeka perileri şu an dinleniyor. Ancak ilham beklemez: Sessiz bir kütüphanede, tozlu bir kitabın içinde bulduğunuz unutulmuş bir mektubu hayal edin.",
      constraint: "En az 3 cümle kullanın."
    };
  }
};

export const evaluateCreativeWriting = async (content: string, prompt: CreativePrompt): Promise<CreativeCritique | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Şu yazarlık denemesini eleştir:
      
      Hedef Kelime: ${prompt.targetWord}
      Tarz: ${prompt.style}
      Senaryo: ${prompt.scenario}
      Kısıtlama: ${prompt.constraint}
      
      Kullanıcının Yazısı: "${content}"
      
      Yazının yaratıcılığını, stile uygunluğunu ve kısıtlamaya uyup uymadığını analiz et. Yapıcı bir eleştirmen gibi konuş (Türkçe).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            creativityScore: { type: Type.INTEGER },
            styleMatch: { type: Type.STRING },
            literaryDeviceUsed: { type: Type.STRING },
            feedback: { type: Type.STRING }
          },
          required: ["creativityScore", "styleMatch", "literaryDeviceUsed", "feedback"]
        }
      }
    });
    return JSON.parse(response.text) as CreativeCritique;
  } catch (error) {
    console.error("Creative Eval Error:", error);
    return {
        creativityScore: 80,
        styleMatch: "Belirsiz",
        literaryDeviceUsed: "Azim",
        feedback: "Bağlantı sorunlarına rağmen yazmaya devam ettiğiniz için tebrikler. Kendi iç sesiniz en iyi eleştirmendir."
    };
  }
};

const getMockDefinition = (word: string): WordData => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  translation: "Çevrimdışı",
  phonetic: `/ˈ${word.toLowerCase()}k/`,
  partOfSpeech: "İsim",
  definitions: [`"${word}" için API kotası aşıldığı için gösterilen yedek tanım. Lütfen daha sonra tekrar deneyiniz.`],
  examples: [`"${word}" kelimesini bir cümlede kullanın.`],
  etymology: `Köken verisi şu anda çevrimdışı.`
});
