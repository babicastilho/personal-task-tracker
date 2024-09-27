// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { createTask } from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  console.log("API GET request initiated");
  try {
    const db = await dbConnect();
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);

    // Fetch all tasks for the authenticated user
    const tasks = await db.collection("tasks").find({ userId }).toArray();

    // Log the tasks retrieved from the database
    console.log("Retrieved tasks:", tasks);

    const currentDate = new Date();
    const tasksWithOverdueStatus = tasks.map(task => ({
      ...task,
      overdue: task.dueDate && new Date(task.dueDate) < currentDate,
      dueDate: task.dueDate, // Ensure dueDate is returned
      dueTime: task.dueTime, // Ensure dueTime is returned
    }));

    // Log tasks after processing for overdue status
    console.log("Processed tasks with dueDate and dueTime:", tasksWithOverdueStatus);

    return NextResponse.json(
      { success: true, tasks: tasksWithOverdueStatus },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const db = await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);
    
    // Corrigir a desestruturação: use dueDate e dueTime em vez de dateInput e timeInput
    const { title, dueDate, dueTime, priority } = await req.json();

    if (!title) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    // Process dueDate and dueTime
    let processedDueDate: Date | undefined = undefined;
    if (dueDate) {
      processedDueDate = new Date(dueDate); // Converta a string em objeto Date

      if (dueTime) {
        const [hours, minutes] = dueTime.split(":").map(Number);
        processedDueDate.setHours(hours, minutes, 0); // Defina horas e minutos, se fornecido
      } else {
        // Defina o horário padrão para 23:59 se não houver hora fornecida
        processedDueDate.setHours(23, 59, 0);
      }
    }

    // Certifique-se de que dueDate e dueTime estão corretos
    console.log("Processed dueDate:", processedDueDate);
    console.log("Processed dueTime:", dueTime);

    const newTask = createTask({
      title,
      userId,
      dueDate: processedDueDate, // Passe a data processada
      dueTime: dueTime || undefined, // Passe dueTime ou undefined
      priority
    });

    // Log da tarefa criada
    console.log("Task to be inserted:", newTask);

    await db.collection('tasks').insertOne(newTask);

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
