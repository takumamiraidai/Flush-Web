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
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedMeal, setSelectedMeal] = useState<MealPlan | null>(null);
  const [weeklyMeals, setWeeklyMeals] = useState<MealPlan[]>([]);

  const getMealByDate = (date: Date): MealPlan | undefined => {
    const formattedDate = date.toISOString().split("T")[0];
    return mealData.find((meal) => meal.date === formattedDate);
  };

  const getMealsForWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const meals = mealData.filter((meal) => {
      const mealDate = new Date(meal.date).getTime();
      return mealDate >= startOfWeek.getTime() && mealDate <= endOfWeek.getTime();
    });

    setWeeklyMeals(meals);
  };

  const handleDateChange = (value: unknown) => {
    if (!value || !(value instanceof Date || Array.isArray(value))) return;

    const date = Array.isArray(value) ? value[0] : value;
    setSelectedDate(date);

    const meal = getMealByDate(date);
    setSelectedMeal(meal || null);

    getMealsForWeek(date);
  };

  return (
    <div className="flex flex-col items-center">
      <Calendar onChange={handleDateChange} value={selectedDate} />
      <div>
        <h2>選択した日付の献立</h2>
        {selectedMeal ? (
          <div>
            <p>{selectedMeal.breakfast}</p>
            <p>{selectedMeal.lunch}</p>
            <p>{selectedMeal.dinner}</p>
          </div>
        ) : (
          <p>データなし</p>
        )}
      </div>
    </div>
  );
};

export default MealCalendar;