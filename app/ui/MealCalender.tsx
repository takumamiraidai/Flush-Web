"use client"
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 

type MealPlan = {
  date: string;  // 日付 (yyyy-mm-dd)
  breakfast: string;
  lunch: string;
  dinner: string;
};

type MealData = MealPlan[];

const mealData: MealData = [
  // 仮のデータ
  { date: '2024-12-01', breakfast: 'パンケーキ', lunch: 'カレーライス', dinner: 'チキンステーキ' },
  { date: '2024-12-02', breakfast: 'トースト', lunch: 'サンドイッチ', dinner: '焼き魚' },
  { date: '2024-12-03', breakfast: 'おにぎり', lunch: 'ラーメン', dinner: 'ハンバーグ' },
  { date: '2024-12-04', breakfast: 'シリアル', lunch: 'うどん', dinner: 'パスタ' },
  { date: '2024-12-05', breakfast: '卵焼き', lunch: 'カツ丼', dinner: 'ビーフシチュー' },
  { date: '2024-12-06', breakfast: 'ヨーグルト', lunch: '親子丼', dinner: 'すき焼き' },
  { date: '2024-12-07', breakfast: 'フルーツサラダ', lunch: 'ピザ', dinner: '焼肉' },
  { date: '2024-12-08', breakfast: 'おにぎり', lunch: 'ラーメン', dinner: 'カルボナーラ' },
  { date: '2024-12-09', breakfast: 'トースト', lunch: 'うどん', dinner: 'サバの味噌煮' },
  { date: '2024-12-10', breakfast: 'シリアル', lunch: 'カレーライス', dinner: 'ステーキ' },
  { date: '2024-12-11', breakfast: '卵焼き', lunch: 'サンドイッチ', dinner: '鍋' },
  { date: '2024-12-12', breakfast: 'ヨーグルト', lunch: 'ビーフシチュー', dinner: '寿司' },
  { date: '2024-12-13', breakfast: 'フルーツサラダ', lunch: 'チャーハン', dinner: 'ラザニア' },
  { date: '2024-12-14', breakfast: 'パンケーキ', lunch: 'ピザ', dinner: 'パスタ' },
];

const MealCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMeal, setSelectedMeal] = useState<MealPlan | null>(null);
  const [weeklyMeals, setWeeklyMeals] = useState<MealPlan[]>([]);

  const getMealByDate = (date: Date): MealPlan | undefined => {
    const formattedDate = date.toISOString().split('T')[0];
    return mealData.find(meal => meal.date === formattedDate);
  };

  const getMealsForWeek = (date: Date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weekMeals = mealData.filter((meal) => {
      const mealDate = new Date(meal.date).getTime();
      return mealDate >= startOfWeek.getTime() && mealDate <= endOfWeek.getTime();
    });

    setWeeklyMeals(weekMeals);
  };

  const handleDateChange = (date: Date | Date[]) => {
    const selected = Array.isArray(date) ? date[0] : date;
    setSelectedDate(selected);

    const meal = getMealByDate(selected);
    setSelectedMeal(meal || null);

    getMealsForWeek(selected);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
        />
        <div className="px-12 pt-10">
          <h2 className="text-xl font-bold mb-4">選択した日付の献立</h2>
          {selectedMeal ? (
            <div>
              <h3 className="font-semibold">
                {selectedDate.toLocaleDateString('ja-JP')} ({selectedDate.toLocaleString('ja-JP', { weekday: 'long' })})
              </h3>
              <p><strong>朝食:</strong> {selectedMeal.breakfast}</p>
              <p><strong>昼食:</strong> {selectedMeal.lunch}</p>
              <p><strong>夕食:</strong> {selectedMeal.dinner}</p>
            </div>
          ) : (
            <p>この日付の献立は設定されていません。</p>
          )}
        </div>
      </div>

      <div className="mt-6 w-full">
        <h1 className="text-xl font-bold mb-4">この週の献立</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {weeklyMeals.map((meal) => (
            <div key={meal.date} className="p-4 border rounded-lg shadow-md">
              <h3 className="font-semibold">
                {meal.date} ({new Date(meal.date).toLocaleString('ja-JP', { weekday: 'long' })})
              </h3>
              <p><strong>朝食:</strong> {meal.breakfast}</p>
              <p><strong>昼食:</strong> {meal.lunch}</p>
              <p><strong>夕食:</strong> {meal.dinner}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealCalendar;