import React from 'react';

export default function BuisinessPage() {
  return (
    <div className="px-4 sm:px-10 lg:px-20">
      <h2 className="pt-10 pb-5 px-2 md:px-8 text-gray-400">お問い合わせ</h2>
      <div className="py-5 px-4 md:px-12">
        <div className="flex flex-col">
          <div className='py-5'>
            <h3 className='pb-5'>販売責任者</h3>
            <p>山本拓摩</p>
          </div>
          <div className='py-5'>
            <h3 className='pb-5'>所在地</h3>
            <p>請求があった場合、開示いたします</p>
          </div>
          <div className='py-5'>
            <h3 className='pb-5'>商品代金に含まれる内容</h3>
            <p>商品ごとに記載しています。また、商品価格には、消費税が含まれています。</p>
          </div>
          <div className='py-5'>
            <h3 className='pb-5'>返品・交換について</h3>
            <p>返品・交換をご希望の場合は、商品到着後1週間以内にご連絡ください。
            返品・交換の際に発生する送料は当社負担となります。</p>
          </div>
          <div className='py-5'>
            <h3 className='pb-5'>お問い合わせ</h3>
            <p>numb20crown.1102@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};