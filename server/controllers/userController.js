import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import { signAuthToken } from "../utils/jwt.js";

const toUserResponse = (user) => {
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

const isInvalidObjectId = (id) => !mongoose.Types.ObjectId.isValid(id);

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "유저 목록 조회에 실패했습니다.",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidObjectId(id)) {
      return res.status(400).json({
        message: "유효하지 않은 유저 ID입니다.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "유저를 찾을 수 없습니다.",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "유저 조회에 실패했습니다.",
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const token = signAuthToken({
      id: user._id,
      email: user.email,
      user_type: user.user_type,
    });

    res.status(201).json({
      message: "유저가 생성되었습니다.",
      token,
      user: toUserResponse(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "이미 사용 중인 이메일입니다.",
      });
    }

    res.status(400).json({
      message: "유저 생성에 실패했습니다.",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "이메일과 비밀번호를 모두 입력해주세요.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const token = signAuthToken({
      id: user._id,
      email: user.email,
      user_type: user.user_type,
    });

    res.json({
      message: "로그인 성공",
      token,
      user: toUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({
      message: "로그인 처리 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "유저를 찾을 수 없습니다.",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "내 정보 조회에 실패했습니다.",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidObjectId(id)) {
      return res.status(400).json({
        message: "유효하지 않은 유저 ID입니다.",
      });
    }

    const user = await User.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "유저를 찾을 수 없습니다.",
      });
    }

    res.json({
      message: "유저가 수정되었습니다.",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "이미 사용 중인 이메일입니다.",
      });
    }

    res.status(400).json({
      message: "유저 수정에 실패했습니다.",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidObjectId(id)) {
      return res.status(400).json({
        message: "유효하지 않은 유저 ID입니다.",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "유저를 찾을 수 없습니다.",
      });
    }

    res.json({
      message: "유저가 삭제되었습니다.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "유저 삭제에 실패했습니다.",
      error: error.message,
    });
  }
};
