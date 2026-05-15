import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateFinancialReport = (data: any) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('tr-TR');

    // Header
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246);
    doc.text('InWallet Finansal Durum Raporu', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Rapor Tarihi: ${date}`, 14, 30);
    doc.text(`Kullanıcı: ${data.username || 'Kullanıcı'}`, 14, 35);

    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Özet Bilgiler', 14, 50);

    const summaryData = [
        ['Toplam Net Varlık', `₺${data.stats.totalNetWorth.toLocaleString()}`],
        ['Nakit Bakiye', `₺${data.stats.cashBalance.toLocaleString()}`],
        ['Toplam Yatırım Değeri', `₺${data.stats.assetValue.toLocaleString()}`],
        ['Aylık Gelir', `₺${data.stats.income.toLocaleString()}`],
        ['Aylık Gider', `₺${data.stats.realExpense.toLocaleString()}`]
    ];

    (doc as any).autoTable({
        startY: 55,
        head: [['Kalem', 'Tutar']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillStyle: [59, 130, 246] }
    });

    // Assets Section
    if (data.assets && data.assets.length > 0) {
        doc.text('Varlık Dağılımı', 14, (doc as any).lastAutoTable.finalY + 15);
        
        const assetData = data.assets.map((a: any) => [
            a.symbol,
            a.type,
            a.quantity,
            `₺${(a.averageBuyPrice || 0).toLocaleString()}`,
            `₺${(a.currentPrice || 0).toLocaleString()}`,
            `₺${(a.quantity * (a.currentPrice || a.averageBuyPrice || 0)).toLocaleString()}`
        ]);

        (doc as any).autoTable({
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [['Sembol', 'Tür', 'Miktar', 'Maliyet', 'Fiyat', 'Toplam Value']],
            body: assetData,
            theme: 'grid'
        });
    }

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text('Bu rapor InWallet AI Finansal Asistan tarafından otomatik oluşturulmuştur.', 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`InWallet_Rapor_${date}.pdf`);
};
