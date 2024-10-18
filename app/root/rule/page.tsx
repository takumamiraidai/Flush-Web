import React from 'react';

export default function RulePage() {
  return (
    <div className="px-4 sm:px-10 lg:px-20">
      <h2 className="pt-10 pb-5 px-2 md:px-8 text-gray-400">ご利用規約</h2>
      <div className="py-5 px-4 md:px-12">
        <div className="flex flex-col">
          <div className='py-5'>
            <h3 className='pb-5'>第1条 世界平和とSDGs</h3>
            <p>世界の人々と地球を大事に思いやりを持って生きよう</p>
          </div>
          <div className='py-5'>
            <h3 className='pb-5'>第2条 優しさは身近なところから</h3>
            <p>まずは身近な人に優しくすることを心がけよう</p>
          </div>
          <div className='py-5'>
            <h3 className='pb-5'>第3条 退会</h3>
            <p>会員は、当社指定の手続きを経て、いつでも退会することができます。</p>
          </div>
          <div className='py-5'>
            <h3 className='pb-5'>第4条 当サイトの著作物の利用</h3>
            <p>当サイトのあらやる素材や文章の二次利用および個人利用を禁止します</p>
          </div>
          <div className='py-5'>
            <h3 className='pb-5'>第5条 ちゃんと見て</h3>
            <p>当サイトは、一部誇大な表現や、誤解を招く表現を含んでいる可能性があります。</p>
          </div>
        </div>
      </div>
    </div>
  );
};