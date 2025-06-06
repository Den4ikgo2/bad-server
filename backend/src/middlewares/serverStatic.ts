import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Определяем полный путь к запрашиваемому файлу
        const filePath = path.join(baseDir, req.path)

        // Проверяем, существует ли файл
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Файл не существует отдаем дальше мидлварам
                console.error('File not found:', filePath); // Логирование ошибки
                return next()
            }
            // Файл существует, отправляем его клиенту
            return res.sendFile(filePath, (error) => {
                if (error) {
                    console.error('Error serving file:', error); // Логирование ошибки
                    next(error)
                }
            })
        })
    }
}