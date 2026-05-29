import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_USER_DATA = {
  email: "",
  password: "",
  user_avatar: "",
  fullName: "",
  phone: "",
  countryCode: "+84",
};

const AccountSettings = () => {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState({ ...DEFAULT_USER_DATA });
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (user) {
      setUserData({
        ...DEFAULT_USER_DATA,
        ...user,
        fullName: user.fullName || user.name || "",
        user_avatar: user.avatarUrl || user.user_avatar || "",
      });
      setAvatar(user.avatarUrl || user.user_avatar || "");
    }
  }, [user]);

  const handleChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    const dataToSave = {
      ...userData,
      fullName: userData.fullName,
      avatarUrl: avatar,
      user_avatar: avatar,
    };

    try {
      const { authService } = await import("../../services/authService");
      const response = await authService.updateProfile(dataToSave);
      if (response.success) {
        const normalized = {
          ...response.data,
          fullName: response.data.fullName || response.data.name || "",
          user_avatar: response.data.avatarUrl || response.data.user_avatar || "",
        };
        setUserData(normalized);
        setUser(normalized);
        authService.setCurrentUser(normalized);
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Cập nhật thất bại, thử lại sau.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Cập nhật thất bại");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setAvatar(base64);
      setUserData((prev) => ({
        ...prev,
        user_avatar: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[420px] text-white">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={
                avatar ||
                "https://i.imgur.com/2DhmtJ4.png"
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover bg-gray-200"
            />

            <label className="absolute bottom-0 right-0 bg-[#26bc71] p-2 rounded-full cursor-pointer">
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <p className="text-center text-gray-300 text-sm mt-3 max-w-[300px]">
            Cung cấp thông tin chính xác sẽ hỗ trợ bạn trong quá trình mua vé,
            hoặc khi cần xác thực vé
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* Họ tên */}
          <div>
            <label className="text-sm text-gray-300">Họ và tên</label>
            <input
              value={userData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full mt-1 bg-[#1f2b25] border border-[#38493f] rounded-lg p-3 outline-none"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="text-sm text-gray-300">Số điện thoại</label>
            <div className="flex gap-2 mt-1">
              <select
                value={userData.countryCode}
                onChange={(e) => handleChange("countryCode", e.target.value)}
                className="bg-[#1f2b25] border border-[#38493f] rounded-lg px-3"
              >
                <option value="+84">+84 Vietnam</option>
                <option value="+1">+1 USA</option>
                <option value="+61">+61 Australia</option>
                <option value="+86">+86 China</option>
              </select>

              <input
                value={userData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="flex-1 bg-[#1f2b25] border border-[#38493f] rounded-lg p-3 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              value={userData.email}
              disabled
              className="w-full mt-1 bg-[#1f2b25] border border-[#38493f] rounded-lg p-3 opacity-70"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#26bc71] hover:bg-[#22a863] py-3 rounded-lg font-semibold mt-3"
          >
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
