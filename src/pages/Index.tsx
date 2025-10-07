import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

interface Anomaly {
  id: string;
  name: string;
  class: 'safe' | 'moderate' | 'danger' | 'critical';
  description: string;
  fullDescription: string;
  containment: string;
  staffNotes: string[];
  interactions: string[];
}

interface Incident {
  id: string;
  anomalyId: string;
  date: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  fullReport: string;
}

const anomalies: Anomaly[] = [
  {
    id: 'Anom-001',
    name: 'Кристаллический резонатор',
    class: 'safe',
    description: 'Кристалл излучающий низкочастотные волны',
    fullDescription: 'Объект представляет собой кристаллическую структуру размером 15x8x8 см, непрерывно излучающую низкочастотные электромагнитные волны. Происхождение неизвестно.',
    containment: 'Хранится в специальном контейнере с экранированием. Доступ разрешён персоналу уровня 2 и выше.',
    staffNotes: [
      'Д-р Соколов: Резонанс усиливается при приближении биологических объектов',
      'Директор Морозова: Одобрено использование в экспериментах серии Б'
    ],
    interactions: ['Не взаимодействует с Anom-003', 'Нейтральная реакция на Anom-007']
  },
  {
    id: 'Anom-003',
    name: 'Временная аномалия',
    class: 'danger',
    description: 'Локальное искажение пространственно-временного континуума',
    fullDescription: 'Сферическая область диаметром 2.4 метра, внутри которой время течёт с переменной скоростью от 0.3x до 4.7x относительно нормального темпа.',
    containment: 'Содержится в камере 15-Б с постоянным мониторингом временных параметров. Вход строго запрещён.',
    staffNotes: [
      'Д-р Петров: Зафиксированы флуктуации каждые 6 часов',
      'Директор Морозова: Использование для практических целей требует дальнейшего изучения'
    ],
    interactions: ['Критическая реакция с Anom-001', 'Стабилизируется при воздействии Anom-009']
  },
  {
    id: 'Anom-007',
    name: 'Разумный туман',
    class: 'moderate',
    description: 'Газообразная субстанция проявляющая признаки сознания',
    fullDescription: 'Облако серого тумана объёмом примерно 4 кубических метра, демонстрирующее целенаправленное поведение и способность к простой коммуникации через изменение плотности.',
    containment: 'Содержится в герметичной камере объёмом 50 м³. Система фильтрации работает в режиме 24/7.',
    staffNotes: [
      'Д-р Волкова: Объект реагирует на голосовые команды',
      'Тех.специалист Иванов: Требуется еженедельная калибровка датчиков'
    ],
    interactions: ['Избегает контакта с Anom-012', 'Нейтрален к большинству объектов']
  },
  {
    id: 'Anom-009',
    name: 'Гравитационный якорь',
    class: 'safe',
    description: 'Артефакт стабилизирующий пространственные аномалии',
    fullDescription: 'Металлический диск диаметром 30 см неизвестного сплава, создающий поле пространственной стабилизации радиусом до 15 метров.',
    containment: 'Хранится в стандартном сейфе. Может использоваться для нейтрализации других аномалий.',
    staffNotes: [
      'Директор Морозова: Критически важный объект для работы с нестабильными аномалиями',
      'Д-р Соколов: Эффективность снижается при длительном использовании'
    ],
    interactions: ['Подавляет эффекты Anom-003', 'Усиливает стабильность всех объектов класса Safe']
  },
  {
    id: 'Anom-012',
    name: 'Фазовый портал',
    class: 'critical',
    description: 'Нестабильный проход в неизвестное измерение',
    fullDescription: 'Пульсирующий портал размером 1.2 x 2.0 метра, ведущий в неизвестную локацию. Периодически из портала появляются непознанные объекты.',
    containment: 'Максимальная изоляция. Камера оснащена системой экстренного запечатывания. Доступ только с разрешения Директора.',
    staffNotes: [
      'Директор Морозова: КРИТИЧНО - усилить охрану',
      'Д-р Петров: Зафиксирована попытка расширения портала 15.03',
      'Спец.отряд Альфа: Готовность к эвакуации уровень максимум'
    ],
    interactions: ['ОПАСНО - не приближать другие аномалии', 'Частично подавляется Anom-009 на расстоянии']
  }
];

const xnomAnomaly: Anomaly = {
  id: 'Xnom-00001',
  name: 'Первородная Сингулярность',
  class: 'critical',
  description: 'Аномалия категории X - абсолютный приоритет',
  fullDescription: 'Объект представляет собой чёрную сферу диаметром 0.5 метра, постоянно поглощающую окружающую материю и энергию. Является единственным объектом класса X в фонде. Точка происхождения всех известных аномалий.',
  containment: 'УРОВЕНЬ ДОСТУПА: ТОЛЬКО ДИРЕКТОР И О5. Содержится в подземном бункере на глубине 500м в специальной камере с многослойной защитой. 20 автономных систем сдерживания. В случае нарушения протокола - автоматическая эвакуация всего комплекса.',
  staffNotes: [
    'Директор Морозова: Объект абсолютной важности. Потеря контроля означает конец',
    'Совет О5: Активировать протокол Омега в случае нарушения целостности',
    'Д-р Соколов: Энергетический выброс увеличивается на 0.03% ежемесячно',
    'Спец.отряд Омега: Постоянное дежурство. Летальная сила авторизована'
  ],
  interactions: [
    'КРИТИЧНО: Влияет на все аномалии в радиусе 5 км',
    'Предположительно - источник возникновения Anom-003 и Anom-012',
    'Anom-009 замедляет расширение на 12%',
    'ЗАПРЕЩЕНО проводить совместные эксперименты с любыми объектами'
  ]
};

const incidents: Incident[] = [
  {
    id: 'INC-001',
    anomalyId: 'Anom-003',
    date: '15.03.2025',
    severity: 'high',
    title: 'Временной разрыв в секторе B',
    description: 'Внезапное расширение временной аномалии',
    fullReport: `ВРЕМЯ: 14:23\nЛОКАЦИЯ: Сектор B, Камера 15-Б\n\nОБСТОЯТЕЛЬСТВА:\nВо время планового наблюдения зафиксировано резкое увеличение радиуса аномалии Anom-003 с 2.4м до 4.1м за 8 секунд. Временное ускорение внутри достигло показателя 7.2x.\n\nПОСЛЕДСТВИЯ:\n- Повреждена система мониторинга\n- Лёгкие травмы у 2 сотрудников (временная дезориентация)\n- Активирован протокол экстренной эвакуации сектора\n\nПРИНЯТЫЕ МЕРЫ:\nИспользован Anom-009 для стабилизации. Через 47 минут параметры вернулись к норме. Установлена дополнительная система предупреждения.\n\nСТАТУС: Закрыт. Процедуры пересмотрены.`
  },
  {
    id: 'INC-002',
    anomalyId: 'Anom-012',
    date: '22.03.2025',
    severity: 'critical',
    title: 'Несанкционированное появление сущностей',
    description: 'Из портала вышли три неизвестных объекта',
    fullReport: `ВРЕМЯ: 03:47\nЛОКАЦИЯ: Камера максимальной защиты 01-X\n\nОБСТОЯТЕЛЬСТВА:\nАном-012 проявил критическую активность. Из портала последовательно материализовались три гуманоидные сущности высотой около 2м. Объекты проявили враждебность к персоналу.\n\nПОСЛЕДСТВИЯ:\n- Активирована система запечатывания\n- Спецотряд Альфа вступил в контакт\n- Нейтрализованы все три сущности\n- Портал временно стабилизировался\n\nАНАЛИЗ:\nСущности имели кремниевую основу, не поддавались стандартному оружию. Эффективны высокочастотные импульсы.\n\nРЕКОМЕНДАЦИИ ДИРЕКТОРА:\nУсилить охрану. Держать Anom-009 в режиме готовности. Рассмотреть варианты постоянной нейтрализации портала.\n\nСТАТУС: Расследование продолжается`
  },
  {
    id: 'INC-003',
    anomalyId: 'Xnom-00001',
    date: '28.03.2025',
    severity: 'critical',
    title: 'Энергетический всплеск Первородной Сингулярности',
    description: 'УРОВЕНЬ УГРОЗЫ: МАКСИМАЛЬНЫЙ',
    fullReport: `УРОВЕНЬ ДОСТУПА: ДИРЕКТОР / О5\n\nВРЕМЯ: 09:15\nЛОКАЦИЯ: Подземный бункер, Камера X-01\n\nОБСТОЯТЕЛЬСТВА:\nXnom-00001 продемонстрировал беспрецедентный энергетический выброс мощностью 847 ТДж. Радиус поглощения увеличился на 3см. Все аномалии в радиусе 5км показали синхронизированную активность.\n\nПОСЛЕДСТВИЯ:\n- Отказ 8 из 20 систем сдерживания\n- Эвакуирован весь персонал уровня 0-2\n- Anom-003 расширился на 40%\n- Anom-012 открылся полностью на 12 секунд\n- Зафиксирована сейсмическая активность\n\nКРИТИЧЕСКИЕ МЕРЫ:\nАктивирован протокол Омега-7. Задействованы все резервные системы. Anom-009 размещён в режиме максимального подавления. Спецотряд Омега переведён на уровень боевой готовности.\n\nДИРЕКТИВА ДИРЕКТОРА:\n"Это первое предупреждение. Если повторится - готовить протокол полной эвакуации комплекса. Совет О5 уведомлён."\n\nСТАТУС: ОТКРЫТ. Постоянный мониторинг 24/7`
  }
];

const staff = [
  { name: 'Директор Морозова Е.А.', role: 'Руководитель фонда', clearance: 'Уровень 5', department: 'Администрация' },
  { name: 'Д-р Соколов В.П.', role: 'Главный исследователь', clearance: 'Уровень 4', department: 'Научный отдел' },
  { name: 'Д-р Петров А.М.', role: 'Специалист по временным аномалиям', clearance: 'Уровень 3', department: 'Научный отдел' },
  { name: 'Д-р Волкова Н.С.', role: 'Биолог-аномалист', clearance: 'Уровень 3', department: 'Научный отдел' },
  { name: 'Командир Железнов', role: 'Глава спецотряда Альфа', clearance: 'Уровень 4', department: 'Безопасность' },
  { name: 'Иванов С.Л.', role: 'Технический специалист', clearance: 'Уровень 2', department: 'Инженерный отдел' }
];

function Index() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [activeTab, setActiveTab] = useState('catalog');

  const getClassColor = (cls: string) => {
    switch (cls) {
      case 'safe': return 'bg-[#10B981]';
      case 'moderate': return 'bg-[#F59E0B]';
      case 'danger': return 'bg-[#DC2626]';
      case 'critical': return 'bg-gradient-to-r from-[#DC2626] to-[#1F2937]';
      default: return 'bg-[#374151]';
    }
  };

  const getClassLabel = (cls: string) => {
    switch (cls) {
      case 'safe': return 'БЕЗОПАСНЫЙ';
      case 'moderate': return 'УМЕРЕННЫЙ';
      case 'danger': return 'ОПАСНЫЙ';
      case 'critical': return 'КРИТИЧЕСКИЙ';
      default: return 'НЕИЗВЕСТНО';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-[#10B981]';
      case 'medium': return 'bg-[#F59E0B]';
      case 'high': return 'bg-[#DC2626]';
      case 'critical': return 'bg-gradient-to-r from-[#DC2626] to-[#000000]';
      default: return 'bg-[#374151]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white">
      <header className="border-b border-[#374151] bg-[#1F2937] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-mono tracking-wider">ФОНД АНОМАЛИЙ</h1>
              <p className="text-xs text-[#9CA3AF] font-mono mt-1">SECURE • CONTAIN • PROTECT</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-[#DC2626] text-[#DC2626] font-mono">
                УРОВЕНЬ ДОСТУПА: 4
              </Badge>
              <Icon name="Shield" className="text-[#DC2626]" size={24} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-[#1F2937] mb-8">
            <TabsTrigger value="catalog" className="font-mono">КАТАЛОГ</TabsTrigger>
            <TabsTrigger value="classification" className="font-mono">КЛАССИФИКАЦИЯ</TabsTrigger>
            <TabsTrigger value="xnom" className="font-mono text-[#DC2626]">XNOM</TabsTrigger>
            <TabsTrigger value="incidents" className="font-mono">ИНЦИДЕНТЫ</TabsTrigger>
            <TabsTrigger value="staff" className="font-mono">ПЕРСОНАЛ</TabsTrigger>
            <TabsTrigger value="about" className="font-mono">О ФОНДЕ</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {anomalies.map((anomaly) => (
                <Card key={anomaly.id} className="bg-[#1F2937] border-[#374151] hover-scale">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="font-mono text-lg">{anomaly.id}</CardTitle>
                      <Icon name="AlertTriangle" className="text-[#F59E0B]" size={20} />
                    </div>
                    <div className={`h-1 w-full ${getClassColor(anomaly.class)} mb-3`}></div>
                    <CardDescription className="text-white font-semibold">{anomaly.name}</CardDescription>
                    <Badge className={`${getClassColor(anomaly.class)} text-white font-mono mt-2`}>
                      {getClassLabel(anomaly.class)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#D1D5DB] mb-4">{anomaly.description}</p>
                    <Button 
                      onClick={() => setSelectedAnomaly(anomaly)}
                      variant="outline" 
                      className="w-full border-[#374151] hover:bg-[#374151] font-mono"
                    >
                      ПРОЧИТАТЬ ПОЛНОСТЬЮ
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="classification" className="animate-fade-in">
            <Card className="bg-[#1F2937] border-[#374151]">
              <CardHeader>
                <CardTitle className="font-mono text-xl">СИСТЕМА КЛАССИФИКАЦИИ УГРОЗ</CardTitle>
                <CardDescription>Уровни опасности объектов фонда</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-8 bg-[#10B981] flex items-center justify-center font-mono font-bold">
                      SAFE
                    </div>
                    <p className="text-sm text-[#D1D5DB]">
                      Объекты легко содержатся и не представляют активной угрозы при соблюдении протоколов
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-8 bg-[#F59E0B] flex items-center justify-center font-mono font-bold">
                      MODERATE
                    </div>
                    <p className="text-sm text-[#D1D5DB]">
                      Требуют специальных условий содержания. Потенциально опасны при нарушении протокола
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-8 bg-[#DC2626] flex items-center justify-center font-mono font-bold">
                      DANGER
                    </div>
                    <p className="text-sm text-[#D1D5DB]">
                      Высокая угроза. Требуют усиленного содержания и постоянного мониторинга
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-8 bg-gradient-to-r from-[#DC2626] to-[#1F2937] flex items-center justify-center font-mono font-bold">
                      CRITICAL
                    </div>
                    <p className="text-sm text-[#D1D5DB]">
                      Экстремальная опасность. Максимальный уровень изоляции. Доступ строго ограничен
                    </p>
                  </div>
                </div>

                <Separator className="bg-[#374151]" />

                <div>
                  <h3 className="font-mono font-bold mb-4 text-[#DC2626]">КЛАСС X (ЭКСКЛЮЗИВНЫЙ)</h3>
                  <p className="text-sm text-[#D1D5DB]">
                    Единственный объект класса X в фонде. Представляет угрозу экзистенциального уровня. 
                    Доступ только для Директора и Совета О5. Автономные системы сдерживания работают 
                    независимо от основной инфраструктуры.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-[#0A0E14] rounded">
                    <div className="text-3xl font-bold text-[#10B981] font-mono">{anomalies.filter(a => a.class === 'safe').length}</div>
                    <div className="text-xs text-[#9CA3AF] mt-1 font-mono">SAFE объектов</div>
                  </div>
                  <div className="text-center p-4 bg-[#0A0E14] rounded">
                    <div className="text-3xl font-bold text-[#DC2626] font-mono">{anomalies.filter(a => a.class === 'danger' || a.class === 'critical').length}</div>
                    <div className="text-xs text-[#9CA3AF] mt-1 font-mono">ОПАСНЫХ объектов</div>
                  </div>
                  <div className="text-center p-4 bg-[#0A0E14] rounded">
                    <div className="text-3xl font-bold text-[#DC2626] font-mono">1</div>
                    <div className="text-xs text-[#9CA3AF] mt-1 font-mono">X-КЛАСС объект</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="xnom" className="animate-fade-in">
            <Card className="bg-gradient-to-br from-[#DC2626] to-[#1F2937] border-[#DC2626] shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-mono text-3xl mb-2">{xnomAnomaly.id}</CardTitle>
                    <CardDescription className="text-white text-xl font-bold">{xnomAnomaly.name}</CardDescription>
                  </div>
                  <Icon name="Skull" className="text-white" size={48} />
                </div>
                <div className="mt-4 p-3 bg-black/40 rounded border-2 border-[#DC2626]">
                  <p className="text-xs font-mono text-white">
                    ⚠️ УРОВЕНЬ ДОСТУПА: ТОЛЬКО ДИРЕКТОР И СОВЕТ О5 ⚠️
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-mono font-bold text-lg mb-2 flex items-center gap-2">
                    <Icon name="FileText" size={20} />
                    ОПИСАНИЕ ОБЪЕКТА
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">{xnomAnomaly.fullDescription}</p>
                </div>

                <Separator className="bg-white/20" />

                <div>
                  <h3 className="font-mono font-bold text-lg mb-2 flex items-center gap-2">
                    <Icon name="Lock" size={20} />
                    ПРОТОКОЛ СОДЕРЖАНИЯ
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">{xnomAnomaly.containment}</p>
                </div>

                <Separator className="bg-white/20" />

                <div>
                  <h3 className="font-mono font-bold text-lg mb-2 flex items-center gap-2">
                    <Icon name="Users" size={20} />
                    ПРИМЕЧАНИЯ ПЕРСОНАЛА
                  </h3>
                  <div className="space-y-3">
                    {xnomAnomaly.staffNotes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-black/40 rounded border-l-4 border-[#F59E0B]">
                        <p className="text-sm text-white/90">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div>
                  <h3 className="font-mono font-bold text-lg mb-2 flex items-center gap-2">
                    <Icon name="GitBranch" size={20} />
                    ВЗАИМОДЕЙСТВИЯ
                  </h3>
                  <div className="space-y-2">
                    {xnomAnomaly.interactions.map((interaction, idx) => (
                      <div key={idx} className="p-2 bg-black/40 rounded text-sm text-white/90">
                        • {interaction}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-black/60 rounded border-2 border-[#DC2626] animate-pulse">
                  <p className="text-center font-mono font-bold text-white">
                    ☢️ СТАТУС: АКТИВНЫЙ МОНИТОРИНГ 24/7 ☢️
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="animate-fade-in">
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Card key={incident.id} className="bg-[#1F2937] border-[#374151] hover-scale">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="font-mono text-lg">{incident.id}</CardTitle>
                          <Badge className={`${getSeverityColor(incident.severity)} text-white font-mono`}>
                            {incident.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <CardDescription className="text-white font-semibold text-base">{incident.title}</CardDescription>
                        <p className="text-xs text-[#9CA3AF] font-mono mt-2">
                          Дата: {incident.date} | Объект: {incident.anomalyId}
                        </p>
                      </div>
                      <Icon name="AlertCircle" className="text-[#DC2626]" size={32} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#D1D5DB] mb-4">{incident.description}</p>
                    <Button 
                      onClick={() => setSelectedIncident(incident)}
                      variant="outline"
                      className="w-full border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-mono"
                    >
                      ЧИТАТЬ ПОЛНЫЙ ОТЧЁТ
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="staff" className="animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              {staff.map((person, idx) => (
                <Card key={idx} className="bg-[#1F2937] border-[#374151]">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon name="User" className="text-[#F59E0B]" size={24} />
                      <div>
                        <CardTitle className="text-lg">{person.name}</CardTitle>
                        <CardDescription className="font-mono text-xs">{person.clearance}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#9CA3AF]">Должность:</span>
                        <span className="text-white">{person.role}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#9CA3AF]">Отдел:</span>
                        <span className="text-white">{person.department}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="animate-fade-in">
            <Card className="bg-[#1F2937] border-[#374151]">
              <CardHeader>
                <CardTitle className="font-mono text-2xl">О ФОНДЕ АНОМАЛИЙ</CardTitle>
                <CardDescription>Защита человечества от неизведанного</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-mono font-bold text-lg mb-3 text-[#F59E0B]">МИССИЯ</h3>
                  <p className="text-sm text-[#D1D5DB] leading-relaxed">
                    Фонд Аномалий - международная организация, занимающаяся обнаружением, изучением и 
                    содержанием аномальных объектов и явлений, представляющих угрозу для обычной реальности. 
                    Наша цель - защитить человечество от того, что оно не готово понять.
                  </p>
                </div>

                <Separator className="bg-[#374151]" />

                <div>
                  <h3 className="font-mono font-bold text-lg mb-3 text-[#F59E0B]">ПРИНЦИПЫ</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#0A0E14] rounded text-center">
                      <Icon name="Lock" className="mx-auto mb-2 text-[#10B981]" size={32} />
                      <h4 className="font-mono font-bold mb-2">SECURE</h4>
                      <p className="text-xs text-[#9CA3AF]">Обезопасить человечество</p>
                    </div>
                    <div className="p-4 bg-[#0A0E14] rounded text-center">
                      <Icon name="Package" className="mx-auto mb-2 text-[#F59E0B]" size={32} />
                      <h4 className="font-mono font-bold mb-2">CONTAIN</h4>
                      <p className="text-xs text-[#9CA3AF]">Содержать аномалии</p>
                    </div>
                    <div className="p-4 bg-[#0A0E14] rounded text-center">
                      <Icon name="Shield" className="mx-auto mb-2 text-[#DC2626]" size={32} />
                      <h4 className="font-mono font-bold mb-2">PROTECT</h4>
                      <p className="text-xs text-[#9CA3AF]">Защитить реальность</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#374151]" />

                <div>
                  <h3 className="font-mono font-bold text-lg mb-3 text-[#F59E0B]">СТРУКТУРА</h3>
                  <div className="space-y-2 text-sm text-[#D1D5DB]">
                    <p>• <strong>Совет О5</strong> - высшее руководство фонда</p>
                    <p>• <strong>Директорат</strong> - оперативное управление</p>
                    <p>• <strong>Научный отдел</strong> - изучение аномалий</p>
                    <p>• <strong>Отдел безопасности</strong> - содержание и защита</p>
                    <p>• <strong>Инженерный отдел</strong> - техническая поддержка</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#0A0E14] rounded border border-[#374151]">
                  <p className="text-center text-xs font-mono text-[#9CA3AF]">
                    Информация на данном портале классифицирована. <br />
                    Несанкционированный доступ преследуется по закону.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedAnomaly} onOpenChange={() => setSelectedAnomaly(null)}>
        <DialogContent className="max-w-3xl bg-[#1F2937] border-[#374151] text-white max-h-[80vh] overflow-y-auto">
          {selectedAnomaly && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle className="font-mono text-2xl">{selectedAnomaly.id}</DialogTitle>
                  <Badge className={`${getClassColor(selectedAnomaly.class)} text-white font-mono`}>
                    {getClassLabel(selectedAnomaly.class)}
                  </Badge>
                </div>
                <DialogDescription className="text-white text-lg font-bold">
                  {selectedAnomaly.name}
                </DialogDescription>
                <div className={`h-2 w-full ${getClassColor(selectedAnomaly.class)} mt-2`}></div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-mono font-bold text-lg mb-2 flex items-center gap-2 text-[#F59E0B]">
                    <Icon name="FileText" size={20} />
                    ОПИСАНИЕ ОБЪЕКТА
                  </h3>
                  <p className="text-sm text-[#D1D5DB] leading-relaxed">{selectedAnomaly.fullDescription}</p>
                </div>

                <Separator className="bg-[#374151]" />

                <div>
                  <h3 className="font-mono font-bold text-lg mb-2 flex items-center gap-2 text-[#F59E0B]">
                    <Icon name="Lock" size={20} />
                    ПРОТОКОЛ СОДЕРЖАНИЯ
                  </h3>
                  <p className="text-sm text-[#D1D5DB] leading-relaxed">{selectedAnomaly.containment}</p>
                </div>

                <Separator className="bg-[#374151]" />

                <div>
                  <h3 className="font-mono font-bold text-lg mb-2 flex items-center gap-2 text-[#F59E0B]">
                    <Icon name="Users" size={20} />
                    ПРИМЕЧАНИЯ ПЕРСОНАЛА
                  </h3>
                  <div className="space-y-2">
                    {selectedAnomaly.staffNotes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-[#0A0E14] rounded border-l-4 border-[#F59E0B]">
                        <p className="text-sm text-[#D1D5DB]">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-[#374151]" />

                <div>
                  <h3 className="font-mono font-bold text-lg mb-2 flex items-center gap-2 text-[#F59E0B]">
                    <Icon name="GitBranch" size={20} />
                    ВЗАИМОДЕЙСТВИЯ С ДРУГИМИ ОБЪЕКТАМИ
                  </h3>
                  <div className="space-y-2">
                    {selectedAnomaly.interactions.map((interaction, idx) => (
                      <div key={idx} className="p-2 bg-[#0A0E14] rounded text-sm text-[#D1D5DB]">
                        • {interaction}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-3xl bg-[#1F2937] border-[#DC2626] text-white max-h-[80vh] overflow-y-auto">
          {selectedIncident && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle className="font-mono text-2xl">{selectedIncident.id}</DialogTitle>
                  <Badge className={`${getSeverityColor(selectedIncident.severity)} text-white font-mono`}>
                    {selectedIncident.severity.toUpperCase()}
                  </Badge>
                </div>
                <DialogDescription className="text-white text-lg font-bold">
                  {selectedIncident.title}
                </DialogDescription>
                <div className="text-xs text-[#9CA3AF] font-mono mt-2">
                  Дата инцидента: {selectedIncident.date} | Связанный объект: {selectedIncident.anomalyId}
                </div>
              </DialogHeader>

              <div className="mt-4">
                <div className="p-4 bg-[#0A0E14] rounded border border-[#374151] font-mono text-sm whitespace-pre-line leading-relaxed">
                  {selectedIncident.fullReport}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="border-t border-[#374151] bg-[#1F2937] mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-xs text-[#9CA3AF] font-mono">
            ФОНД АНОМАЛИЙ © 2025 | УРОВЕНЬ СЕКРЕТНОСТИ: ВЫСОКИЙ | ВСЕ ПРАВА ЗАЩИЩЕНЫ
          </p>
          <p className="text-xs text-[#DC2626] font-mono mt-2">
            ⚠️ НЕСАНКЦИОНИРОВАННЫЙ ДОСТУП КАРАЕТСЯ ЗАКОНОМ ⚠️
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Index;
