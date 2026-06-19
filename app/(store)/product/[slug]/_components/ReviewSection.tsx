"use client";

import React, { useState, useTransition } from "react";
import { Star, MessageCircle, AlertCircle, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { createReviewAction } from "@/lib/actions/review";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

type ReviewWithUser = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
  };
};

interface ReviewSectionProps {
  productId: string;
  reviews: ReviewWithUser[];
}

export default function ReviewSection({ productId, reviews }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const hasReviewed = session?.user?.id 
    ? reviews.some((r) => r.user.name === session.user.name) // or check by ID if available, but here we can only check loosely since user.id is not fetched, wait, we didn't fetch user.id. We can just rely on the server action to reject duplicates.
    : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await createReviewAction({
        productId,
        rating,
        comment,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(res.success || "บันทึกรีวิวสำเร็จ");
        setComment("");
        setRating(5);
      }
    });
  };

  return (
    <div className="mt-16 border-t border-[#E5E5E5] pt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* สรุปคะแนนรีวิว */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-black fill-black" />
            รีวิวจากลูกค้า
          </h2>
          <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-[#E5E5E5] text-center">
            <div className="text-5xl font-bold mb-2">{averageRating}</div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(Number(averageRating))
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-500 text-sm">จากทั้งหมด {reviews.length} รีวิว</p>
          </div>
        </div>

        {/* ฟอร์มเขียนรีวิว และรายการรีวิว */}
        <div className="md:col-span-2">
          {session ? (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-sm mb-10">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                เขียนรีวิวของคุณ
              </h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2 border border-green-100">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">ให้คะแนนสินค้า</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">ข้อความรีวิว (ไม่บังคับ)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="แบ่งปันความประทับใจของคุณที่มีต่อสินค้านี้..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black resize-none h-24 text-sm"
                  disabled={isPending}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 cursor-pointer"
              >
                {isPending ? "กำลังส่งข้อมูล..." : "ส่งรีวิว"}
              </button>
            </form>
          ) : (
            <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-[#E5E5E5] text-center mb-10">
              <p className="text-gray-600 mb-4">กรุณาเข้าสู่ระบบก่อนทำการรีวิวสินค้า</p>
              <a href="/login" className="inline-block bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                เข้าสู่ระบบ
              </a>
            </div>
          )}

          {/* รายการรีวิวทั้งหมด */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl mb-6">รีวิวล่าสุด</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">ยังไม่มีรีวิวสำหรับสินค้านี้ เป็นคนแรกที่รีวิวสิ!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-[#E5E5E5] pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase text-sm">
                      {review.user.name ? review.user.name.charAt(0) : "U"}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{review.user.name || "ผู้ใช้งาน"}</div>
                      <div className="text-xs text-gray-500">{dayjs(review.createdAt).format("DD MMM YYYY")}</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
