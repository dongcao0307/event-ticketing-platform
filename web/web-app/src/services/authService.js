// src/services/authService.js

export const authService = {
  // 1. Đăng ký (lưu temp_user + otp vào temp storage)
  register: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        if (users.find(u => u.email === email)) {
          reject(new Error('Email này đã được đăng ký!'));
          return;
        }

        const tempUser = {
          email,
          password,
          user_avatar: '',
          name: '',
          phone: '',
          countryCode: '+84',
          birthDate: '',
          gender: 'Nam',
        };

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        localStorage.setItem('temp_user', JSON.stringify(tempUser));
        localStorage.setItem('temp_otp', otp);

        console.log('[OTP giả lập]', otp);

        resolve({ success: true, message: 'Đăng ký thành công! Mã OTP đã được gửi tới email.' });
      }, 1000);
    });
  },

  // 2. Xác thực OTP và kích hoạt tài khoản
  verifyOtp: async (otpInput) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tempUser = JSON.parse(localStorage.getItem('temp_user') || 'null');
        const storedOtp = localStorage.getItem('temp_otp');

        if (!tempUser || !storedOtp) {
          reject(new Error('Không có yêu cầu OTP hiện tại. Vui lòng đăng ký lại.'));
          return;
        }

        if (String(otpInput).trim() !== storedOtp) {
          reject(new Error('OTP không chính xác. Vui lòng kiểm tra lại.'));
          return;
        }

        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        if (!users.find((u) => u.email === tempUser.email)) {
          users.push(tempUser);
          localStorage.setItem('mockUsers', JSON.stringify(users));
        }

        localStorage.removeItem('temp_user');
        localStorage.removeItem('temp_otp');

        resolve({ success: true, message: 'Xác thực OTP thành công! Tài khoản đã được kích hoạt.' });
      }, 800);
    });
  },

  // 2b. Gửi lại OTP (resend)
  resendOtp: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tempUser = JSON.parse(localStorage.getItem('temp_user') || 'null');
        if (!tempUser) {
          reject(new Error('Không tìm thấy thông tin đăng ký tạm thời. Vui lòng đăng ký lại.'));
          return;
        }

        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        localStorage.setItem('temp_otp', newOtp);
        console.log('[OTP giả lập resend]', newOtp);
        resolve({ success: true, message: 'OTP đã được gửi lại.' });
      }, 600);
    });
  },

  // 3. Đăng nhập (Giữ nguyên)
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          reject(new Error('Sai email hoặc mật khẩu!'));
          return;
        }

        const fakeToken = 'fake.jwt.token.' + btoa(email);
        localStorage.setItem('jwt_token', fakeToken);
        localStorage.setItem('user_data', JSON.stringify(user));
        resolve({ success: true, token: fakeToken });
      }, 800);
    });
  },

  // 3. Cập nhật thông tin người dùng
  updateProfile: async (userData) => {
    return new Promise((resolve, reject) => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user_data') || '{}');
        const updatedUser = { ...storedUser, ...userData };

        localStorage.setItem('user_data', JSON.stringify(updatedUser));

        // Cập nhật luôn vào mockUsers nếu tồn tại
        const usersRaw = localStorage.getItem('mockUsers');
        if (usersRaw) {
          const users = JSON.parse(usersRaw);
          const idx = users.findIndex((u) => u.email === updatedUser.email);
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...updatedUser };
            localStorage.setItem('mockUsers', JSON.stringify(users));
          }
        }

        resolve({ success: true, data: updatedUser });
      } catch {
        reject(new Error('Cập nhật thông tin thất bại.'));
      }
    });
  },

  // 4. Đăng xuất (Giữ nguyên)
  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }
};