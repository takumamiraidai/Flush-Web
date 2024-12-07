"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const MealCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [num, setNum] = useState<number | undefined>(undefined);
  const [time, setTime] = useState<string>("breakfast");
  const [dishes, setDishes] = useState<string[]>([]);
  const [availableDishes, setAvailableDishes] = useState<
    { id: number; name: string }[]
  >([]);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [menu, setMenu] = useState<any>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const handleDateChange = (date: Date | Date[]) => {
    const selected = Array.isArray(date) ? date[0] : date;
    setSelectedDate(selected);
  };

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/dish`);
        if (!response.ok) {
          throw new Error(`料理データ取得失敗: ${response.statusText}`);
        }
        const data = await response.json();
        setAvailableDishes(data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
        setStatusMessage("料理データの取得中にエラーが発生しました。");
      }
    };
    fetchDishes();
  }, [BASE_URL]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // ローカルの日付を正しくフォーマットする関数
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0ベース
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
  
        const formattedDate = formatDate(selectedDate);
        const response = await fetch(
          `${BASE_URL}/api/get_menu?date=${formattedDate}`
        );
        if (!response.ok) {
          throw new Error(`献立データ取得失敗: ${response.statusText}`);
        }
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setMenu(null);
        setStatusMessage("献立データの取得中にエラーが発生しました。");
      }
    };
    fetchMenu();
  }, [selectedDate, BASE_URL]);
  
  const handleMenuDishSubmit = async () => {
    try {
      // ローカルの日付を正しくフォーマットする関数
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0ベース
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
  
      const formattedDate = formatDate(selectedDate);
      const dishIds = availableDishes
        .filter((dish) => dishes.includes(dish.name))
        .map((dish) => ({ id: dish.id }));
  
      const response = await fetch(`${BASE_URL}/api/post_menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu: { date: formattedDate, time },
          dishes: dishIds,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      const responseBody = await response.json();
      setStatusMessage(responseBody.message || "献立登録に成功しました。");
      setDishes([]);
    } catch (error) {
      console.error("Error submitting MenuDish:", error);
      setStatusMessage(
        `献立登録中にエラーが発生しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`
      );
    }
  };  

  const handleMenuNumSubmit = async () => {
    try {
      // ローカルの日付を正しくフォーマットする関数
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0ベース
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
  
      // フォーマットした日付を取得
      const formattedDate = formatDate(selectedDate);
  
      if (!num || num <= 0) {
        setStatusMessage("人数を正しく入力してください。");
        return;
      }
  
      const response = await fetch(`${BASE_URL}/api/menunum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: formattedDate, time, num }),
      });
  
      if (!response.ok) {
        throw new Error(`人数登録失敗: ${await response.text()}`);
      }
  
      setStatusMessage("人数が登録されました！");
    } catch (error) {
      console.error("Error submitting MenuNum:", error);
      setStatusMessage("人数登録中にエラーが発生しました。");
    }
  };
  
  const renderMenu = () => {
    if (!menu || menu.length === 0) {
      return <p>この日の献立はありません。</p>;
    }
  
    // 時間帯ごとの順番を指定
    const timeOrder = ['breakfast', 'lunch', 'dinner'];
  
    // 献立を時間帯ごとにグループ化
    const groupedMenu = menu.reduce((acc: any, item: any) => {
      const timeKey = item.time;
      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }
      acc[timeKey].push(item); // dish.nameとカロリーを含むアイテムを追加
      return acc;
    }, {});
  
    // 時間帯ごとの献立をレンダリング
    return (
      <div className="flex space-x-6">
        {timeOrder.map((timeKey) => {
          const items = groupedMenu[timeKey];
          if (!items) return null;

          // 時間帯ごとのスタイル
          const timeStyles = {
            breakfast: 'bg-yellow-100 text-yellow-800',
            lunch: 'bg-green-100 text-green-800',
            dinner: 'bg-blue-100 text-blue-800',
          };

          return (
            <div key={timeKey} className={`p-4 rounded-lg ${timeStyles[timeKey]} min-w-[250px]`}>
              <h3 className="font-bold text-lg">{timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}</h3>
              <ul>
                {items.map((item: any, index: number) => {
                  const calories = item.dish.calories;
                  return (
                    <li key={index} className="flex justify-between py-2">
                      <span>{item.dish.name}</span>
                      <span>{item.dish.calorie} kcal</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">献立カレンダー</h1>
      <div className="flex items-start space-x-6">
        <div className="w-full max-w-md">
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>

        <div className="w-full max-w-lg p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">人数と献立を登録</h2>

          <div className="flex items-center space-x-6 mb-4">
            <div className="flex flex-col">
              <label className="block">日付: {selectedDate.toLocaleDateString()}</label>
            </div>
      
            <div className="flex flex-col">
              <label className="block">食事区分:</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="breakfast">朝食</option>
                  <option value="lunch">昼食</option>
                  <option value="dinner">夕食</option>
                </select>
              <div className="flex flex-col">
                <label className="block">人数:</label>
                <input
                  type="number"
                  value={num || ""}
                  onChange={(e) => setNum(Number(e.target.value) || undefined)}
                  className="p-2 border rounded w-20"
                  placeholder="人数を入力してください"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block">料理を選択:</label>
              <select
                multiple
                value={dishes}
                onChange={(e) => setDishes(Array.from(e.target.selectedOptions, (option) => option.value))}
                className="p-2 border rounded"
              >
                {availableDishes.map((dish) => (
                  <option key={dish.id} value={dish.name}>
                    {dish.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleMenuNumSubmit}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            人数を登録
          </button>

          <button
            onClick={handleMenuDishSubmit}
            className={`w-full p-2 ${
              dishes.length > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
            } text-white rounded mt-4`}
            disabled={dishes.length === 0}
          >
            献立を登録
          </button>
          <div className="mt-6 text-center text-red-600">{statusMessage}</div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">登録された献立</h2>
        {renderMenu()}
      </div>
    </div>
  );
};

export default MealCalendar;
