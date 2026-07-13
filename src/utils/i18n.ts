/**
 * @fileoverview Internationalization (i18n) utility for multilingual support.
 * Provides translations for FIFA World Cup 2026 stadium operations.
 */

import { Language } from '@/types';

/** Translation keys used in the application. */
type TranslationKey =
  | 'welcome'
  | 'dashboard'
  | 'assistant'
  | 'crowd'
  | 'wayfinding'
  | 'transport'
  | 'sustainability'
  | 'emergency'
  | 'volunteer'
  | 'send'
  | 'search'
  | 'loading'
  | 'error'
  | 'askAI'
  | 'findSeat'
  | 'reportEmergency'
  | 'lowDensity'
  | 'moderateDensity'
  | 'highDensity'
  | 'criticalDensity'
  | 'accessibleRoute'
  | 'nearestExit'
  | 'nearestRestroom'
  | 'nearestMedical';

/** Translation dictionary type. */
type Translations = Record<TranslationKey, string>;

/** All available translations. */
const translations: Record<Language, Translations> = {
  [Language.English]: {
    welcome: 'Welcome to StadiumAI',
    dashboard: 'Dashboard',
    assistant: 'AI Assistant',
    crowd: 'Crowd Management',
    wayfinding: 'Wayfinding',
    transport: 'Transport',
    sustainability: 'Sustainability',
    emergency: 'Emergency',
    volunteer: 'Volunteer Hub',
    send: 'Send',
    search: 'Search...',
    loading: 'Loading...',
    error: 'Something went wrong',
    askAI: 'Ask StadiumAI anything...',
    findSeat: 'Find my seat',
    reportEmergency: 'Report Emergency',
    lowDensity: 'Low crowd density',
    moderateDensity: 'Moderate crowd density',
    highDensity: 'High crowd density',
    criticalDensity: 'Critical — avoid area',
    accessibleRoute: 'Accessible route available',
    nearestExit: 'Find nearest exit',
    nearestRestroom: 'Find nearest restroom',
    nearestMedical: 'Find nearest medical station',
  },
  [Language.Spanish]: {
    welcome: 'Bienvenido a StadiumAI',
    dashboard: 'Panel',
    assistant: 'Asistente IA',
    crowd: 'Gestión de Multitudes',
    wayfinding: 'Navegación',
    transport: 'Transporte',
    sustainability: 'Sostenibilidad',
    emergency: 'Emergencia',
    volunteer: 'Centro de Voluntarios',
    send: 'Enviar',
    search: 'Buscar...',
    loading: 'Cargando...',
    error: 'Algo salió mal',
    askAI: 'Pregunta a StadiumAI...',
    findSeat: 'Encontrar mi asiento',
    reportEmergency: 'Reportar Emergencia',
    lowDensity: 'Baja densidad',
    moderateDensity: 'Densidad moderada',
    highDensity: 'Alta densidad',
    criticalDensity: 'Crítico — evitar zona',
    accessibleRoute: 'Ruta accesible disponible',
    nearestExit: 'Salida más cercana',
    nearestRestroom: 'Baño más cercano',
    nearestMedical: 'Estación médica más cercana',
  },
  [Language.French]: {
    welcome: 'Bienvenue sur StadiumAI',
    dashboard: 'Tableau de bord',
    assistant: 'Assistant IA',
    crowd: 'Gestion de foule',
    wayfinding: 'Orientation',
    transport: 'Transport',
    sustainability: 'Durabilité',
    emergency: 'Urgence',
    volunteer: 'Espace bénévoles',
    send: 'Envoyer',
    search: 'Rechercher...',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    askAI: 'Demandez à StadiumAI...',
    findSeat: 'Trouver ma place',
    reportEmergency: "Signaler une urgence",
    lowDensity: 'Faible densité',
    moderateDensity: 'Densité modérée',
    highDensity: 'Haute densité',
    criticalDensity: 'Critique — éviter la zone',
    accessibleRoute: 'Itinéraire accessible disponible',
    nearestExit: 'Sortie la plus proche',
    nearestRestroom: 'Toilettes les plus proches',
    nearestMedical: 'Station médicale la plus proche',
  },
  [Language.Arabic]: {
    welcome: 'مرحبا بك في StadiumAI',
    dashboard: 'لوحة التحكم',
    assistant: 'المساعد الذكي',
    crowd: 'إدارة الحشود',
    wayfinding: 'التوجيه',
    transport: 'النقل',
    sustainability: 'الاستدامة',
    emergency: 'الطوارئ',
    volunteer: 'مركز المتطوعين',
    send: 'إرسال',
    search: 'بحث...',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ ما',
    askAI: 'اسأل StadiumAI أي شيء...',
    findSeat: 'ابحث عن مقعدي',
    reportEmergency: 'الإبلاغ عن حالة طوارئ',
    lowDensity: 'كثافة منخفضة',
    moderateDensity: 'كثافة متوسطة',
    highDensity: 'كثافة عالية',
    criticalDensity: 'حرج — تجنب المنطقة',
    accessibleRoute: 'مسار يسهل الوصول إليه',
    nearestExit: 'أقرب مخرج',
    nearestRestroom: 'أقرب دورة مياه',
    nearestMedical: 'أقرب محطة طبية',
  },
  [Language.Portuguese]: {
    welcome: 'Bem-vindo ao StadiumAI', dashboard: 'Painel', assistant: 'Assistente IA', crowd: 'Gestão de Multidões', wayfinding: 'Navegação', transport: 'Transporte', sustainability: 'Sustentabilidade', emergency: 'Emergência', volunteer: 'Central de Voluntários', send: 'Enviar', search: 'Pesquisar...', loading: 'Carregando...', error: 'Algo deu errado', askAI: 'Pergunte ao StadiumAI...', findSeat: 'Encontrar meu assento', reportEmergency: 'Reportar Emergência', lowDensity: 'Baixa densidade', moderateDensity: 'Densidade moderada', highDensity: 'Alta densidade', criticalDensity: 'Crítico — evitar área', accessibleRoute: 'Rota acessível disponível', nearestExit: 'Saída mais próxima', nearestRestroom: 'Banheiro mais próximo', nearestMedical: 'Posto médico mais próximo',
  },
  [Language.German]: {
    welcome: 'Willkommen bei StadiumAI', dashboard: 'Dashboard', assistant: 'KI-Assistent', crowd: 'Crowd Management', wayfinding: 'Wegfindung', transport: 'Transport', sustainability: 'Nachhaltigkeit', emergency: 'Notfall', volunteer: 'Freiwillige', send: 'Senden', search: 'Suchen...', loading: 'Laden...', error: 'Etwas ist schiefgelaufen', askAI: 'Fragen Sie StadiumAI...', findSeat: 'Meinen Platz finden', reportEmergency: 'Notfall melden', lowDensity: 'Geringe Dichte', moderateDensity: 'Mittlere Dichte', highDensity: 'Hohe Dichte', criticalDensity: 'Kritisch — Bereich meiden', accessibleRoute: 'Barrierefreier Weg verfügbar', nearestExit: 'Nächster Ausgang', nearestRestroom: 'Nächste Toilette', nearestMedical: 'Nächste Sanitätsstation',
  },
  [Language.Japanese]: {
    welcome: 'StadiumAIへようこそ', dashboard: 'ダッシュボード', assistant: 'AIアシスタント', crowd: '群衆管理', wayfinding: '案内', transport: '交通', sustainability: 'サステナビリティ', emergency: '緊急', volunteer: 'ボランティア', send: '送信', search: '検索...', loading: '読み込み中...', error: 'エラーが発生しました', askAI: 'StadiumAIに質問...', findSeat: '座席を探す', reportEmergency: '緊急通報', lowDensity: '低密度', moderateDensity: '中密度', highDensity: '高密度', criticalDensity: '危険 — エリア回避', accessibleRoute: 'バリアフリールート', nearestExit: '最寄りの出口', nearestRestroom: '最寄りのトイレ', nearestMedical: '最寄りの救護室',
  },
  [Language.Korean]: {
    welcome: 'StadiumAI에 오신 것을 환영합니다', dashboard: '대시보드', assistant: 'AI 어시스턴트', crowd: '군중 관리', wayfinding: '길 안내', transport: '교통', sustainability: '지속가능성', emergency: '비상', volunteer: '자원봉사', send: '보내기', search: '검색...', loading: '로딩 중...', error: '문제가 발생했습니다', askAI: 'StadiumAI에 질문하기...', findSeat: '좌석 찾기', reportEmergency: '비상 신고', lowDensity: '낮은 밀도', moderateDensity: '보통 밀도', highDensity: '높은 밀도', criticalDensity: '위험 — 지역 회피', accessibleRoute: '접근 가능한 경로', nearestExit: '가장 가까운 출구', nearestRestroom: '가장 가까운 화장실', nearestMedical: '가장 가까운 의료실',
  },
  [Language.Chinese]: {
    welcome: '欢迎使用 StadiumAI', dashboard: '仪表盘', assistant: 'AI 助手', crowd: '人群管理', wayfinding: '导航', transport: '交通', sustainability: '可持续性', emergency: '紧急', volunteer: '志愿者中心', send: '发送', search: '搜索...', loading: '加载中...', error: '出了点问题', askAI: '向 StadiumAI 提问...', findSeat: '找到我的座位', reportEmergency: '报告紧急情况', lowDensity: '低密度', moderateDensity: '中等密度', highDensity: '高密度', criticalDensity: '危险 — 避开该区域', accessibleRoute: '无障碍路线', nearestExit: '最近的出口', nearestRestroom: '最近的洗手间', nearestMedical: '最近的医疗站',
  },
  [Language.Hindi]: {
    welcome: 'StadiumAI में आपका स्वागत है', dashboard: 'डैशबोर्ड', assistant: 'AI सहायक', crowd: 'भीड़ प्रबंधन', wayfinding: 'दिशा-निर्देश', transport: 'परिवहन', sustainability: 'स्थिरता', emergency: 'आपातकाल', volunteer: 'स्वयंसेवक केंद्र', send: 'भेजें', search: 'खोजें...', loading: 'लोड हो रहा है...', error: 'कुछ गलत हो गया', askAI: 'StadiumAI से कुछ भी पूछें...', findSeat: 'मेरी सीट खोजें', reportEmergency: 'आपातकाल की रिपोर्ट', lowDensity: 'कम भीड़', moderateDensity: 'मध्यम भीड़', highDensity: 'अधिक भीड़', criticalDensity: 'गंभीर — क्षेत्र से बचें', accessibleRoute: 'सुलभ मार्ग उपलब्ध', nearestExit: 'निकटतम निकास', nearestRestroom: 'निकटतम शौचालय', nearestMedical: 'निकटतम चिकित्सा केंद्र',
  },
  [Language.Russian]: {
    welcome: 'Добро пожаловать в StadiumAI', dashboard: 'Панель', assistant: 'ИИ-ассистент', crowd: 'Управление толпой', wayfinding: 'Навигация', transport: 'Транспорт', sustainability: 'Устойчивость', emergency: 'Экстренные ситуации', volunteer: 'Волонтёры', send: 'Отправить', search: 'Поиск...', loading: 'Загрузка...', error: 'Что-то пошло не так', askAI: 'Спросите StadiumAI...', findSeat: 'Найти моё место', reportEmergency: 'Сообщить о ЧП', lowDensity: 'Низкая плотность', moderateDensity: 'Средняя плотность', highDensity: 'Высокая плотность', criticalDensity: 'Критично — избегайте зоны', accessibleRoute: 'Доступный маршрут', nearestExit: 'Ближайший выход', nearestRestroom: 'Ближайший туалет', nearestMedical: 'Ближайший медпункт',
  },
  [Language.Dutch]: {
    welcome: 'Welkom bij StadiumAI', dashboard: 'Dashboard', assistant: 'AI-assistent', crowd: 'Crowd Management', wayfinding: 'Wegwijzer', transport: 'Vervoer', sustainability: 'Duurzaamheid', emergency: 'Noodgeval', volunteer: 'Vrijwilligers', send: 'Verstuur', search: 'Zoeken...', loading: 'Laden...', error: 'Er ging iets mis', askAI: 'Vraag StadiumAI...', findSeat: 'Vind mijn stoel', reportEmergency: 'Noodgeval melden', lowDensity: 'Lage dichtheid', moderateDensity: 'Gemiddelde dichtheid', highDensity: 'Hoge dichtheid', criticalDensity: 'Kritiek — vermijd gebied', accessibleRoute: 'Toegankelijke route', nearestExit: 'Dichtstbijzijnde uitgang', nearestRestroom: 'Dichtstbijzijnd toilet', nearestMedical: 'Dichtstbijzijnd EHBO-post',
  },
};

/**
 * Translates a key to the given language.
 * Falls back to English if the key or language is not found.
 * @param key - The translation key.
 * @param language - The target language.
 * @returns The translated string.
 */
export function t(key: TranslationKey, language: Language = Language.English): string {
  return translations[language]?.[key] ?? translations[Language.English]?.[key] ?? key;
}

/** Returns the display name for a language code. */
export function getLanguageName(lang: Language): string {
  const names: Record<Language, string> = {
    [Language.English]: 'English',
    [Language.Spanish]: 'Español',
    [Language.French]: 'Français',
    [Language.Arabic]: 'العربية',
    [Language.Portuguese]: 'Português',
    [Language.German]: 'Deutsch',
    [Language.Japanese]: '日本語',
    [Language.Korean]: '한국어',
    [Language.Chinese]: '中文',
    [Language.Hindi]: 'हिन्दी',
    [Language.Russian]: 'Русский',
    [Language.Dutch]: 'Nederlands',
  };
  return names[lang] ?? lang;
}
