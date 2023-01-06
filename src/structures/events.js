process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('uncaughtException:', error);
});

process.on('uncaughtExceptionMonitor', (error) => {
    console.error('uncaughtExceptionMonitor:', error);
});
