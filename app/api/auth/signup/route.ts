import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { readJson, writeJson } from "@/lib/db"
import { signToken, createResponseWithCookie } from "@/lib/auth"

interface User {
  id: string
  username: string
  password: string
  role: string
  leagueId: string | null
  createdAt: string
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const users = await readJson<User[]>("users.json")

    if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      password: hashedPassword,
      role: "user",
      leagueId: null,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    await writeJson("users.json", users)

    const token = await signToken({
      userId: newUser.id,
      username: newUser.username,
      isAdmin: false,
    })

    return createResponseWithCookie(
      {
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
          leagueId: newUser.leagueId,
        },
      },
      token
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
