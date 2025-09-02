import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Brain,
  Heart,
  Target,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Trade } from '@/types/trading';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'analysis' | 'risk' | 'psychology' | 'education' | 'motivation';
}

interface TradingAssistantProps {
  trades: Trade[];
  isOpen: boolean;
  onToggle: () => void;
}

export const TradingAssistant: React.FC<TradingAssistantProps> = ({
  trades,
  isOpen,
  onToggle
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: `Halo! 👋 Saya asisten trading AI Anda. Saya siap membantu menganalisa trading journal, memberikan saran risk management, dan dukungan psikologi trading.

Saya sudah menganalisa ${trades.length} trade Anda. Mau saya berikan insight tentang performa trading Anda?`,
        timestamp: new Date(),
        category: 'motivation'
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const analyzeTradeData = () => {
    const closedTrades = trades.filter(t => t.status === 'closed');
    const winningTrades = closedTrades.filter(t => (t.profit_loss || 0) > 0);
    const losingTrades = closedTrades.filter(t => (t.profit_loss || 0) < 0);
    
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0) / losingTrades.length) : 0;
    const riskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : 0;
    
    return {
      totalTrades: trades.length,
      closedTrades: closedTrades.length,
      openTrades: trades.filter(t => t.status === 'open').length,
      winRate,
      totalPnL,
      avgWin,
      avgLoss,
      riskRewardRatio,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length
    };
  };

  const generateAIResponse = (userMessage: string): Message => {
    const stats = analyzeTradeData();
    const message = userMessage.toLowerCase();
    
    let response = '';
    let category: Message['category'] = 'analysis';

    if (message.includes('analisa') || message.includes('perform') || message.includes('statistik')) {
      category = 'analysis';
      response = `📊 **Analisa Trading Anda:**

• Total Trades: ${stats.totalTrades} (${stats.closedTrades} closed, ${stats.openTrades} open)
• Win Rate: ${stats.winRate.toFixed(1)}%
• Total P&L: ${stats.totalPnL > 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
• Risk-Reward Ratio: ${stats.riskRewardRatio.toFixed(2)}:1

${stats.winRate < 50 ? 
  '⚠️ Win rate Anda masih di bawah 50%. Focus pada quality setup dan cut loss dengan disiplin.' : 
  '✅ Win rate Anda bagus! Pertahankan strategi yang sudah terbukti profitable.'
}`;
    } else if (message.includes('risk') || message.includes('risiko') || message.includes('lot')) {
      category = 'risk';
      response = `🎯 **Saran Risk Management:**

Berdasarkan data trading Anda:
• Rata-rata loss: ${stats.avgLoss.toFixed(2)}
• Rata-rata win: ${stats.avgWin.toFixed(2)}

**Rekomendasi:**
1. Risiko maksimal 2% per trade dari total balance
2. ${stats.riskRewardRatio < 1.5 ? 'Tingkatkan target profit atau kurangi stop loss untuk RR ratio minimal 1:1.5' : 'RR ratio Anda sudah bagus, pertahankan!'}
3. Gunakan position sizing yang konsisten
4. Jangan revenge trading setelah loss beruntun`;
    } else if (message.includes('psikologi') || message.includes('emosi') || message.includes('feeling')) {
      category = 'psychology';
      response = `🧠 **Psychology Trading Check:**

${stats.totalPnL < 0 ? 
  '😔 Saya melihat Anda sedang dalam drawdown. Ini normal dalam trading! Yang penting:' : 
  '😊 Performa Anda positif, tapi tetap jaga mental:'
}

• **Jangan FOMO** - Tunggu setup yang benar-benar valid
• **Terima Loss** - Loss adalah bagian dari trading, bukan kegagalan
• **Stay Disciplined** - Stick to your trading rules
• **Take Break** - Jika emosi mulai menguasai, istirahat dulu

💡 **Reminder:** Trading sukses 80% psychology, 20% strategy!`;
    } else if (message.includes('tips') || message.includes('belajar') || message.includes('edukasi')) {
      category = 'education';
      response = `📚 **Tips Trading Hari Ini:**

Berdasarkan pattern trading Anda:

${stats.winRate > 60 ? 
  '🎉 Win rate Anda tinggi! Fokus pada konsistensi dan jangan overconfident.' :
  '📈 Mari tingkatkan win rate dengan:'
}

1. **Pre-market Analysis** - Selalu analisa market sebelum trading
2. **Risk-Reward Planning** - Set target dan stop loss sebelum entry
3. **Market Session** - Trading pada session yang paling cocok dengan strategi
4. **Journaling** - Catat emosi dan reasoning setiap trade

**Golden Rule:** Plan your trade, trade your plan! 💪`;
    } else if (message.includes('motivasi') || message.includes('semangat') || message.includes('down')) {
      category = 'motivation';
      response = `💪 **Motivasi Trading:**

${stats.totalPnL > 0 ? 
  '🎯 Great job! Profit Anda menunjukkan Anda di jalan yang benar. Terus konsisten!' :
  '🌟 Setiap trader profesional pernah mengalami drawdown. Yang membedakan: mereka tidak menyerah!'
}

**Remember:**
• Setiap loss adalah pelajaran berharga
• Konsistensi > hasil jangka pendek  
• Professional trader fokus pada process, bukan hasil
• Your next trade could be the turning point! 🚀

Keep going, trader! Anda sudah berani mengambil langkah untuk improve. That's 50% of the battle won! 💎🙌`;
    } else {
      response = `Halo! Saya bisa membantu Anda dengan:

📊 **"analisa"** - Statistik trading performance
🎯 **"risk"** - Saran risk management
🧠 **"psikologi"** - Mental trading support  
📚 **"tips"** - Edukasi trading
💪 **"motivasi"** - Dukungan mental

Atau tanya apa saja tentang trading Anda!`;
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      category
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputValue('');
  };

  const getCategoryIcon = (category?: Message['category']) => {
    switch (category) {
      case 'analysis': return <TrendingUp className="w-4 h-4" />;
      case 'risk': return <Target className="w-4 h-4" />;
      case 'psychology': return <Brain className="w-4 h-4" />;
      case 'education': return <MessageCircle className="w-4 h-4" />;
      case 'motivation': return <Heart className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category?: Message['category']) => {
    switch (category) {
      case 'analysis': return 'bg-primary/10 text-primary border-primary/20';
      case 'risk': return 'bg-neutral/10 text-neutral border-neutral/20';
      case 'psychology': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'education': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'motivation': return 'bg-profit/10 text-profit border-profit/20';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 bottom-4 w-96 z-50">
      <Card className="h-full flex flex-col trading-card bg-card/95 backdrop-blur-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Trading Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">Your personal trading mentor</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {message.type === 'assistant' && message.category && (
                        <Badge 
                          variant="secondary" 
                          className={`mb-2 ${getCategoryColor(message.category)}`}
                        >
                          {getCategoryIcon(message.category)}
                          <span className="ml-1 capitalize">{message.category}</span>
                        </Badge>
                      )}
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tanya tentang trading Anda..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {['analisa', 'risk', 'psikologi', 'tips', 'motivasi'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputValue(suggestion)}
                    className="text-xs h-6 px-2"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};