"use client";

import { X, Star, Mail, Ticket, Phone, MapPin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCustomerProfile, generateAndSendDiscount } from "@/lib/actions/customers";

interface CustomerProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
}

type CustomerProfileType = Awaited<ReturnType<typeof getCustomerProfile>>;

export function CustomerProfileSheet({ isOpen, onClose, customerId }: CustomerProfileSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CustomerProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sendingDiscount, setSendingDiscount] = useState(false);
  const [discountSuccess, setDiscountSuccess] = useState<string | null>(null);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountType, setDiscountType] = useState<"FIXED" | "PERCENTAGE">("FIXED");
  const [discountAmount, setDiscountAmount] = useState("");

  const submitDiscount = async () => {
    if (!customerId || !discountAmount || isNaN(Number(discountAmount)) || Number(discountAmount) <= 0) return;

    setSendingDiscount(true);
    setDiscountSuccess(null);
    try {
      const res = await generateAndSendDiscount(customerId, Number(discountAmount), discountType);
      if (res.success) {
        setDiscountSuccess(`Generated code ${res.code} and emailed to ${res.email}`);
        setShowDiscountForm(false);
        setDiscountAmount("");
        setTimeout(() => setDiscountSuccess(null), 8000);
      }
    } catch (err) {
      alert("Failed to send discount");
    } finally {
      setSendingDiscount(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && customerId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
      getCustomerProfile(customerId)
        .then((data) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load customer profile.");
          setLoading(false);
        });
    }
  }, [isOpen, customerId]);

  if (!mounted) return null;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-black text-lg uppercase">โปรไฟล์ลูกค้า</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <p>{error}</p>
            </div>
          ) : profile ? (
            <>
              {/* Profile Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center justify-center text-2xl font-bold">
                  {getInitials(profile.name)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-black flex items-center gap-2">{profile.name || "Unknown"}</h3>
                  {profile.isVip && (
                    <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1 text-yellow-600 fill-current" /> สมาชิกระดับ VIP
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    เป็นลูกค้าตั้งแต่ {new Date(profile.createdAt).toLocaleDateString("th-TH", { month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* CRM Action Buttons */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" /> ส่งอีเมล
                  </button>
                  <button 
                    onClick={() => setShowDiscountForm(!showDiscountForm)}
                    disabled={sendingDiscount}
                    className={`border border-gray-200 rounded-xl py-2.5 text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 ${showDiscountForm ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-50'}`}
                  >
                    <Ticket className="w-5 h-5" /> 
                    ส่งส่วนลด
                  </button>
                </div>
                
                {/* Inline Beautiful Form for Discount */}
                {showDiscountForm && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <h5 className="text-sm font-bold mb-3 flex items-center justify-between">
                      ตั้งค่าส่วนลด
                      <button onClick={() => setShowDiscountForm(false)} className="text-gray-400 hover:text-black">
                        <X className="w-4 h-4" />
                      </button>
                    </h5>
                    
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">ประเภท</label>
                        <select 
                          value={discountType} 
                          onChange={(e) => setDiscountType(e.target.value as "FIXED" | "PERCENTAGE")}
                          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white h-10"
                        >
                          <option value="FIXED">ลดเป็นยอดเงิน (บาท)</option>
                          <option value="PERCENTAGE">ลดเป็นเปอร์เซ็นต์ (%)</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">มูลค่า</label>
                        <input 
                          type="number" 
                          placeholder={discountType === "FIXED" ? "เช่น 50" : "เช่น 20"}
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black h-10"
                        />
                      </div>
                    </div>
                    
                    <button 
                      onClick={submitDiscount}
                      disabled={sendingDiscount || !discountAmount}
                      className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sendingDiscount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                      สร้างโค้ดและส่ง
                    </button>
                  </div>
                )}

                {discountSuccess && (
                  <div className="mt-2 bg-green-50 text-green-700 text-xs p-3 rounded-lg border border-green-200 text-center font-medium">
                    {discountSuccess}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">ยอดใช้จ่ายรวม</p>
                  <p className="font-black text-xl text-black">
                    ${profile.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">จำนวนคำสั่งซื้อ</p>
                  <p className="font-black text-xl text-black">{profile.totalOrdersCount}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">ยอดซื้อเฉลี่ย (AOV)</p>
                  <p className="font-black text-xl text-black">
                    ${profile.aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-8">
                <h4 className="font-bold text-sm text-black mb-4 uppercase tracking-wider">ข้อมูลการติดต่อ</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-black font-medium">{profile.email}</span>
                  </div>
                  {profile.addresses && profile.addresses.length > 0 ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">{profile.addresses[0].phone}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-500">
                          {profile.addresses[0].street}<br/>
                          {profile.addresses[0].subdistrict}, {profile.addresses[0].district}<br/>
                          {profile.addresses[0].province} {profile.addresses[0].postalCode}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500 italic">ไม่ได้ระบุที่อยู่</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Purchase History */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-black uppercase tracking-wider">ประวัติการสั่งซื้อล่าสุด</h4>
                </div>
                
                <div className="space-y-4">
                  {profile.orders.length > 0 ? profile.orders.map((order) => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-black">#ORD-{order.id.substring(0, 4).toUpperCase()}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {new Date(order.createdAt).toLocaleDateString("th-TH", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{order.orderItems.length} ชิ้น</span>
                        <span className="font-bold text-sm text-black">
                          ${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 italic">ไม่มีประวัติการสั่งซื้อ</p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
