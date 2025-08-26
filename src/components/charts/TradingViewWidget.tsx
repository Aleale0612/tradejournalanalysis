import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface TradingViewWidgetProps {
  symbol: string;
  title: string;
  width?: string;
  height?: string;
  interval?: string;
  theme?: 'light' | 'dark';
}

export function TradingViewWidget({ 
  symbol, 
  title, 
  width = "100%", 
  height = "400",
  interval = "1D",
  theme = "dark"
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: false,
      width: width,
      height: height,
      symbol: symbol,
      interval: interval,
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: "en",
      backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)",
      gridColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: false,
      studies: [
        "STD;SMA",
        "STD;EMA",
        "STD;RSI",
        "STD;MACD"
      ],
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "650",
      no_referral_id: true,
      watchlist: [
        "FX:EURUSD",
        "FX:GBPUSD",
        "FX:USDJPY",
        "OANDA:XAUUSD",
        "TVC:DXY",
        "NASDAQ:AAPL",
        "NASDAQ:TSLA"
      ]
    });

    container.current.appendChild(script);

    // Cleanup function
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, width, height, interval, theme]);

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          className="tradingview-widget-container" 
          ref={container}
          style={{ height: `${height}px` }}
        >
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </CardContent>
    </Card>
  );
}