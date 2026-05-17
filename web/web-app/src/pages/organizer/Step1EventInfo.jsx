import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  ImageIcon,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon2,
  PlaySquare,
  ChevronDown,
} from "lucide-react";

const Step1EventInfo = ({ eventData, setEventData }) => {
  const thumbnailRef = useRef(null);
  const posterRef = useRef(null);
  const logoRef = useRef(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error("Lỗi lấy Tỉnh/Thành:", error));
  }, []);

  useEffect(() => {
    if (eventData?.province && provinces.length > 0) {
      const matchedProv = provinces.find((p) => p.name === eventData.province);
      if (matchedProv && matchedProv.code !== selectedProvinceCode) {
        setSelectedProvinceCode(matchedProv.code);
        axios
          .get(
            `https://provinces.open-api.vn/api/p/${matchedProv.code}?depth=2`,
          )
          .then((response) => setDistricts(response.data.districts))
          .catch((err) => console.error("Lỗi lấy huyện:", err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData?.province, provinces]);

  useEffect(() => {
    if (eventData?.district && districts.length > 0) {
      const matchedDist = districts.find((d) => d.name === eventData.district);
      if (matchedDist && matchedDist.code !== selectedDistrictCode) {
        setSelectedDistrictCode(matchedDist.code);
        axios
          .get(
            `https://provinces.open-api.vn/api/d/${matchedDist.code}?depth=2`,
          )
          .then((response) => setWards(response.data.wards))
          .catch((err) => console.error("Lỗi lấy xã:", err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData?.district, districts]);

  const validateField = (field, value) => {
    let errorMsg = "";
    switch (field) {
      case "title":
        if (!value || !value.trim()) errorMsg = "Vui lòng nhập tên sự kiện";
        else if (value.length > 100) errorMsg = "Tên sự kiện tối đa 100 ký tự";
        break;
      case "venueName":
        if (!value || !value.trim()) errorMsg = "Vui lòng nhập tên địa điểm";
        else if (value.length > 80) errorMsg = "Tên địa điểm tối đa 80 ký tự";
        break;
      case "province":
        if (!value) errorMsg = "Vui lòng chọn Tỉnh/Thành phố";
        break;
      case "street":
        if (!value || !value.trim())
          errorMsg = "Vui lòng nhập số nhà, tên đường";
        else if (value.length > 80) errorMsg = "Địa chỉ tối đa 80 ký tự";
        break;
      case "description":
        if (!value || !value.trim())
          errorMsg = "Vui lòng nhập thông tin chi tiết sự kiện";
        break;
      case "organizerName":
        if (!value || !value.trim()) errorMsg = "Vui lòng nhập tên Ban tổ chức";
        else if (value.length > 80) errorMsg = "Tên BTC tối đa 80 ký tự";
        break;
      case "organizerInfo":
        if (!value || !value.trim())
          errorMsg = "Vui lòng nhập thông tin Ban tổ chức";
        else if (value.length > 500)
          errorMsg = "Thông tin BTC tối đa 500 ký tự";
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleBlur = (field, value) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    setSelectedProvinceCode(code);
    handleChange("province", name);
    handleBlur("province", name);

    setDistricts([]);
    setWards([]);
    setSelectedDistrictCode("");
    handleChange("district", "");
    handleChange("ward", "");

    if (code) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
        .then((response) => setDistricts(response.data.districts));
    }
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    setSelectedDistrictCode(code);
    handleChange("district", name);

    setWards([]);
    handleChange("ward", "");

    if (code) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
        .then((response) => setWards(response.data.wards));
    }
  };

  const handleWardChange = (e) => {
    const name = e.target.options[e.target.selectedIndex].text;
    handleChange("ward", name);
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      handleChange(fieldName, objectUrl);
      handleChange(`${fieldName}File`, file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "/api/organizer/files/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        handleChange(fieldName, response.data.url);
      } catch (error) {
        console.error(`Lỗi upload ảnh cho ${fieldName}:`, error);
        alert("Quá trình tải ảnh lên máy chủ thất bại. Vui lòng thử lại!");
        handleChange(fieldName, "");
      }
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* ===== BLOCK 1: UPLOAD HÌNH ẢNH ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-red-500 mr-1">*</span>
            <span className="font-bold text-sm">Upload hình ảnh</span>
            <a href="#" className="text-[#00b14f] text-sm hover:underline ml-4">
              Xem vị trí hiển thị các ảnh
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div
            onClick={() => thumbnailRef.current.click()}
            className="relative w-full md:w-[30%] border-2 border-dashed border-gray-600 rounded-lg bg-[#2a2b31] hover:bg-[#34353c] transition-colors cursor-pointer flex flex-col items-center justify-center h-[320px] overflow-hidden"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={thumbnailRef}
              onChange={(e) => handleImageUpload(e, "thumbnailUrl")}
            />
            {eventData?.thumbnailUrl &&
            !eventData.thumbnailUrl.includes("placeholder.com") ? (
              <div className="w-full h-full relative group">
                <img
                  src={eventData.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium">
                    Đổi ảnh khác
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="text-[#00b14f] mb-3">
                  <ImageIcon size={40} strokeWidth={1.5} />
                </div>
                <p className="text-center text-sm text-gray-300">
                  Thêm ảnh sự kiện để
                  <br />
                  hiển thị ở các vị trí khác
                  <br />
                  <span className="font-bold text-gray-200">(720x958)</span>
                </p>
              </>
            )}
          </div>

          <div
            onClick={() => posterRef.current.click()}
            className="relative w-full md:w-[70%] border-2 border-dashed border-gray-600 rounded-lg bg-[#2a2b31] hover:bg-[#34353c] transition-colors cursor-pointer flex flex-col items-center justify-center h-[320px] overflow-hidden"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={posterRef}
              onChange={(e) => handleImageUpload(e, "posterUrl")}
            />
            {eventData?.posterUrl &&
            !eventData.posterUrl.includes("placeholder.com") ? (
              <div className="w-full h-full relative group">
                <img
                  src={eventData.posterUrl}
                  alt="Poster"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium">
                    Đổi ảnh khác
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="text-[#00b14f] mb-3">
                  <ImageIcon size={40} strokeWidth={1.5} />
                </div>
                <p className="text-center text-sm text-gray-300">
                  Thêm ảnh nền sự kiện
                  <br />
                  <span className="font-bold text-gray-200">(1280x720)</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== BLOCK 2: TÊN SỰ KIỆN ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <label className="block mb-2 font-bold text-sm">
          <span className="text-red-500 mr-1">*</span>Tên sự kiện
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Tên sự kiện"
            value={eventData?.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={(e) => handleBlur("title", e.target.value)}
            className={`w-full p-2.5 rounded bg-white text-black text-sm outline-none pr-16 transition-all ${errors.title ? "border border-red-500 ring-1 ring-red-500" : "border-none focus:ring-2 focus:ring-[#00b14f]"}`}
          />
          <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
            {eventData?.title?.length || 0} / 100
          </span>
        </div>
        {errors.title && (
          <p className="text-red-500 text-xs mt-2">{errors.title}</p>
        )}
      </div>

      {/* ===== BLOCK 3: ĐỊA CHỈ SỰ KIỆN ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <div className="mb-5">
          <label className="block mb-3 font-bold text-sm">
            <span className="text-red-500 mr-1">*</span>Địa chỉ sự kiện
          </label>
          <div className="flex space-x-8">
            <label className="flex items-center cursor-pointer group">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 transition-colors ${eventData?.eventType === "offline" ? "border-[#00b14f]" : "border-gray-400 group-hover:border-gray-300"}`}
              >
                {eventData?.eventType === "offline" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00b14f]"></div>
                )}
              </div>
              <span className="text-sm">Sự kiện Offline</span>
              <input
                type="radio"
                className="hidden"
                checked={eventData?.eventType === "offline"}
                onChange={() => handleChange("eventType", "offline")}
              />
            </label>
            <label className="flex items-center cursor-pointer group">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 transition-colors ${eventData?.eventType === "online" ? "border-[#00b14f]" : "border-gray-400 group-hover:border-gray-300"}`}
              >
                {eventData?.eventType === "online" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00b14f]"></div>
                )}
              </div>
              <span className="text-sm">Sự kiện Online</span>
              <input
                type="radio"
                className="hidden"
                checked={eventData?.eventType === "online"}
                onChange={() => handleChange("eventType", "online")}
              />
            </label>
          </div>
        </div>

        <div className="mb-5 relative">
          <label className="block mb-2 font-bold text-sm">
            <span className="text-red-500 mr-1">*</span>Tên địa điểm
          </label>
          <input
            type="text"
            placeholder="Tên địa điểm"
            value={eventData?.venueName || ""}
            onChange={(e) => handleChange("venueName", e.target.value)}
            onBlur={(e) => handleBlur("venueName", e.target.value)}
            className={`w-full p-2.5 rounded bg-white text-black text-sm outline-none pr-16 transition-all ${errors.venueName ? "border border-red-500 ring-1 ring-red-500" : "border-none focus:ring-2 focus:ring-[#00b14f]"}`}
          />
          <span className="absolute right-3 bottom-2.5 text-gray-400 text-sm">
            {eventData?.venueName?.length || 0} / 80
          </span>
          {errors.venueName && (
            <p className="text-red-500 text-xs mt-2">{errors.venueName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative">
            <label className="block mb-2 font-bold text-sm">
              <span className="text-red-500 mr-1">*</span>Tỉnh/Thành
            </label>
            <select
              value={selectedProvinceCode}
              onChange={handleProvinceChange}
              onBlur={() => handleBlur("province", eventData?.province)}
              className={`w-full p-2.5 rounded bg-white text-gray-800 text-sm outline-none appearance-none cursor-pointer transition-all ${errors.province ? "border border-red-500 ring-1 ring-red-500" : "border-none focus:ring-2 focus:ring-[#00b14f]"}`}
            >
              <option value="">Chọn Tỉnh/Thành</option>
              {provinces.map((prov) => (
                <option key={prov.code} value={prov.code}>
                  {prov.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 bottom-2.5 text-gray-400 pointer-events-none"
              size={18}
            />
            {errors.province && (
              <p className="text-red-500 text-xs mt-2">{errors.province}</p>
            )}
          </div>

          <div className="relative">
            <label className="block mb-2 font-bold text-sm">Quận/Huyện</label>
            <select
              value={selectedDistrictCode}
              onChange={handleDistrictChange}
              disabled={!selectedProvinceCode}
              className="w-full p-2.5 rounded bg-white text-gray-800 text-sm border-none focus:ring-2 focus:ring-[#00b14f] outline-none appearance-none cursor-pointer disabled:bg-gray-200 disabled:text-gray-500"
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((dist) => (
                <option key={dist.code} value={dist.code}>
                  {dist.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 bottom-2.5 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>

          <div className="relative">
            <label className="block mb-2 font-bold text-sm">Phường/Xã</label>
            <select
              value={wards.find((w) => w.name === eventData?.ward)?.code || ""}
              onChange={handleWardChange}
              disabled={!selectedDistrictCode}
              className="w-full p-2.5 rounded bg-white text-gray-800 text-sm border-none focus:ring-2 focus:ring-[#00b14f] outline-none appearance-none cursor-pointer disabled:bg-gray-200 disabled:text-gray-500"
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 bottom-2.5 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>

          <div className="relative">
            <label className="block mb-2 font-bold text-sm">
              <span className="text-red-500 mr-1">*</span>Số nhà, đường
            </label>
            <input
              type="text"
              placeholder="Số nhà, đường"
              value={eventData?.street || ""}
              onChange={(e) => handleChange("street", e.target.value)}
              onBlur={(e) => handleBlur("street", e.target.value)}
              className={`w-full p-2.5 rounded bg-white text-black text-sm outline-none pr-16 transition-all ${errors.street ? "border border-red-500 ring-1 ring-red-500" : "border-none focus:ring-2 focus:ring-[#00b14f]"}`}
            />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
              {eventData?.street?.length || 0} / 80
            </span>
            {errors.street && (
              <p className="text-red-500 text-xs mt-2">{errors.street}</p>
            )}
          </div>
        </div>
      </div>

      {/* ===== BLOCK 4: THỂ LOẠI SỰ KIỆN (ĐÃ ĐỒNG BỘ ĐÚNG ID DATABASE) ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <label className="block mb-2 font-bold text-sm">
          <span className="text-red-500 mr-1">*</span>Thể loại sự kiện
        </label>
        <div className="relative">
          <select
            value={eventData?.categoryId || 2}
            onChange={(e) => {
              const id = parseInt(e.target.value);
              const enumMap = {
                1: "THEATER",
                2: "MUSIC",
                3: "SPORTS",
                4: "WORKSHOP",
                5: "FESTIVAL",
                6: "COMEDY",
                7: "EXHIBITION",
                8: "OTHER",
              };

              setEventData((prev) => ({
                ...prev,
                categoryId: id,
                category: enumMap[id] || "OTHER",
              }));
            }}
            className="w-full p-2.5 rounded bg-white text-gray-600 text-sm border-none outline-none appearance-none cursor-pointer"
          >
            <option value={2}>Nhạc sống</option>
            <option value={1}>Sân khấu & Nghệ thuật</option>
            <option value={3}>Thể thao</option>
            <option value={4}>Hội thảo & Workshop</option>
            <option value={5}>Tham quan & Trải nghiệm</option>
            <option value={6}>Hài kịch</option>
            <option value={7}>Triển lãm</option>
            <option value={8}>Khác</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* ===== BLOCK 5: THÔNG TIN SỰ KIỆN ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <label className="block mb-2 font-bold text-sm">
          <span className="text-red-500 mr-1">*</span>Thông tin sự kiện
        </label>
        <div
          className={`border rounded-md overflow-hidden bg-[#2a2b31] transition-all ${errors.description ? "border-red-500 ring-1 ring-red-500" : "border-[#3a3b40]"}`}
        >
          <div className="px-3 py-2 flex flex-wrap items-center gap-4 border-b border-[#3a3b40]">
            <div className="flex items-center gap-1 bg-transparent text-sm text-gray-300 cursor-pointer">
              Paragraph <ChevronDown size={14} className="ml-1" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-white border border-gray-400 rounded-sm cursor-pointer"></div>
              <div className="w-4 h-4 bg-black border border-gray-600 rounded-sm cursor-pointer"></div>
              <div className="w-4 h-4 bg-red-500 rounded-sm cursor-pointer"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-sm cursor-pointer"></div>
            </div>
            <div className="flex items-center gap-2 text-gray-400 border-l border-gray-600 pl-4">
              <button className="hover:text-white">
                <Bold size={16} />
              </button>
              <button className="hover:text-white">
                <Italic size={16} />
              </button>
              <button className="hover:text-white">
                <Underline size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-gray-400 border-l border-gray-600 pl-4">
              <button className="hover:text-white">
                <AlignLeft size={16} />
              </button>
              <button className="hover:text-white">
                <AlignCenter size={16} />
              </button>
              <button className="hover:text-white">
                <AlignRight size={16} />
              </button>
              <button className="hover:text-white">
                <AlignJustify size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-gray-400 border-l border-gray-600 pl-4">
              <button className="hover:text-white">
                <List size={16} />
              </button>
              <button className="hover:text-white">
                <ListOrdered size={16} />
              </button>
              <button className="hover:text-white ml-2">
                <ImageIcon2 size={16} />
              </button>
              <button className="hover:text-white">
                <PlaySquare size={16} />
              </button>
            </div>
          </div>
          <textarea
            value={eventData?.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={(e) => handleBlur("description", e.target.value)}
            className="w-full p-4 bg-[#1f2026] text-sm text-gray-300 border-none outline-none resize-y min-h-[250px] leading-relaxed"
            placeholder="Giới thiệu sự kiện, chương trình chính, khách mời, điều khoản..."
          ></textarea>
        </div>
        {errors.description && (
          <p className="text-red-500 text-xs mt-2">{errors.description}</p>
        )}
      </div>

      {/* ===== BLOCK 6: BAN TỔ CHỨC ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31] flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[220px] shrink-0">
          <div
            onClick={() => logoRef.current.click()}
            className="relative border-2 border-dashed border-gray-600 rounded-lg bg-[#2a2b31] hover:bg-[#34353c] transition-colors cursor-pointer flex flex-col items-center justify-center h-[220px] overflow-hidden"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={logoRef}
              onChange={(e) => handleImageUpload(e, "organizerLogo")}
            />
            {eventData?.organizerLogo ? (
              <div className="w-full h-full relative group">
                <img
                  src={eventData.organizerLogo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium">
                    Đổi Logo
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon size={32} className="text-[#00b14f] mx-auto mb-2" />
                <p className="text-xs text-gray-400">
                  Thêm logo BTC
                  <br />
                  (275x275)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5">
          <div className="relative">
            <label className="block mb-2 font-bold text-sm">
              <span className="text-red-500 mr-1">*</span>Tên ban tổ chức
            </label>
            <input
              type="text"
              placeholder="Nhập tên ban tổ chức"
              value={eventData?.organizerName || ""}
              onChange={(e) => handleChange("organizerName", e.target.value)}
              onBlur={(e) => handleBlur("organizerName", e.target.value)}
              className={`w-full p-2.5 rounded bg-white text-black text-sm outline-none pr-16 transition-all ${errors.organizerName ? "border border-red-500 ring-1 ring-red-500" : "border-none focus:ring-2 focus:ring-[#00b14f]"}`}
            />
            <span className="absolute right-3 top-9 text-gray-400 text-xs">
              {eventData?.organizerName?.length || 0} / 80
            </span>
            {errors.organizerName && (
              <p className="text-red-500 text-xs mt-2">
                {errors.organizerName}
              </p>
            )}
          </div>

          <div className="relative flex-1 flex flex-col">
            <label className="block mb-2 font-bold text-sm">
              <span className="text-red-500 mr-1">*</span>Thông tin ban tổ chức
            </label>
            <textarea
              placeholder="Thông tin ban tổ chức"
              value={eventData?.organizerInfo || ""}
              onChange={(e) => handleChange("organizerInfo", e.target.value)}
              onBlur={(e) => handleBlur("organizerInfo", e.target.value)}
              className={`w-full flex-1 p-2.5 rounded bg-white text-black text-sm outline-none resize-none pr-16 min-h-[120px] transition-all ${errors.organizerInfo ? "border border-red-500 ring-1 ring-red-500" : "border-none focus:ring-2 focus:ring-[#00b14f]"}`}
            ></textarea>
            <span className="absolute right-3 bottom-2 text-gray-400 text-xs">
              {eventData?.organizerInfo?.length || 0} / 500
            </span>
            {errors.organizerInfo && (
              <p className="text-red-500 text-xs mt-2">
                {errors.organizerInfo}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1EventInfo;
