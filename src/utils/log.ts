const projectName = import.meta.env.VITE_GLOB_APP_TITLE

export const warn = (message: string): void => {
    console.warn(`[${projectName} warn]:${message}`)
}

export const error = (message: string): void => {
    throw new Error(`[${projectName} error]:${message}`)
}
