
import { Collection } from '../types';

export const CURATED_COLLECTIONS: Collection[] = [
  {
    id: 'lit-1',
    title: 'Edebi Mücevherler',
    description: 'Bir resim çizen kelimeler, seçici okuyucu ve yazar için özenle hazırlanmış.',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    words: [
      {
        word: "Pulchritudinous",
        phonetic: "/ˌpʌlkrɪˈtjuːdɪnəs/",
        partOfSpeech: "Sıfat",
        definitions: ["Büyük fiziksel güzelliğe sahip."],
        examples: ["O güzel manzara nefes kesiciydi."],
        etymology: "Latince pulchritudo 'güzellik' kelimesinden.",
        etymologyStages: ["Latince: pulcher (güzel)", "Latince: pulchritudo", "İngilizce: pulchritudinous"],
        synonyms: ["Güzel", "Muhteşem", "Enfes"],
        register: "Resmi, Edebi",
        connotation: "Olumlu",
        idioms: [],
      },
      {
        word: "Ethereal",
        phonetic: "/ɪˈθɪəriəl/",
        partOfSpeech: "Sıfat",
        definitions: ["Son derece narin ve hafif, sanki bu dünyaya ait değilmiş gibi mükemmel."],
        examples: ["Onun o ilahi güzelliği odadaki herkesi büyüledi."],
        etymology: "Yunanca aithēr 'üst hava' kelimesinden.",
        etymologyStages: ["Yunanca: aithēr", "Latince: aetherius", "İngilizce: ethereal"],
        synonyms: ["Narin", "Semavi", "Başka dünyaya ait"],
        register: "Edebi",
        connotation: "Olumlu",
        idioms: [],
      }
    ]
  },
  {
    id: 'arch-1',
    title: 'Mimari Harikalar',
    description: 'Yapı, form ve mekan dili, antik sütunlardan modern cephelere.',
    imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    words: [
      {
        word: "Fenestration",
        phonetic: "/ˌfɛnɪˈstreɪʃn/",
        partOfSpeech: "İsim",
        definitions: ["Bir binanın cephelerindeki pencere ve kapıların düzenlenmesi."],
        examples: ["Binanın pencere düzeni doğal ışığı en üst düzeye çıkarmak için tasarlandı."],
        etymology: "Latince fenestra 'pencere' kelimesinden.",
        etymologyStages: ["Latince: fenestra", "İngilizce: fenestration"],
        synonyms: ["Pencere düzeni", "Camlama"],
        register: "Teknik",
        connotation: "Nötr",
        idioms: [],
      },
      {
        word: "Cantilever",
        phonetic: "/ˈkæntɪˌliːvər/",
        partOfSpeech: "İsim",
        definitions: ["Yalnızca bir ucundan sabitlenmiş, genellikle köprü inşaatında kullanılan uzun çıkıntılı kiriş."],
        examples: ["Balkon, bahçenin üzerine doğru uzanan bir konsoldu."],
        etymology: "Kökeni belirsiz, belki 'cant' (kenar) + 'lever' (kaldıraç).",
        etymologyStages: ["Bilinmeyen Köken"],
        synonyms: ["Çıkıntı", "Konsol", "Braket"],
        register: "Teknik",
        connotation: "Nötr",
        idioms: [],
      }
    ]
  },
  {
    id: 'sci-1',
    title: 'Bilimsel Kavramlar',
    description: 'Evreni tanımlayan kelime dağarcığını keşfedin, kuantumdan kozmiğe.',
    imageUrl: 'https://images.unsplash.com/photo-1574974671999-636df4045c41?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    words: [
      {
        word: "Heuristic",
        phonetic: "/hjʊˈrɪstɪk/",
        partOfSpeech: "Sıfat",
        definitions: ["Bir kişinin bir şeyi kendisi keşfetmesini veya öğrenmesini sağlayan."],
        examples: ["Öğretmen problem çözmede buluşsal bir yaklaşım kullandı."],
        etymology: "Yunanca heuriskein 'bulmak' kelimesinden.",
        etymologyStages: ["Yunanca: heuriskein", "İngilizce: heuristic"],
        synonyms: ["Meraklı", "Araştırmacı", "Deneysel"],
        register: "Akademik",
        connotation: "Nötr",
        idioms: [],
      },
      {
        word: "Catalyst",
        phonetic: "/ˈkætəlɪst/",
        partOfSpeech: "İsim",
        definitions: ["Kendisinin kalıcı bir kimyasal değişime uğramadan bir kimyasal reaksiyonun hızını artıran madde."],
        examples: ["Enzim reaksiyonda bir katalizör görevi gördü."],
        etymology: "Yunanca kataluein 'çözmek' kelimesinden.",
        etymologyStages: ["Yunanca: luein (serbest bırakmak)", "Yunanca: kataluein", "İngilizce: catalyst"],
        synonyms: ["Hızlandırıcı", "İtici güç", "Uyarıcı"],
        register: "Bilimsel",
        connotation: "Nötr",
        idioms: [],
      }
    ]
  }
];
