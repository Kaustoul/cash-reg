export interface ISettings {
    sepaSettings: {
        enabled: boolean;
        bic?: string;
        iban?: string;
        recipientName?: string;
        paymentReason?: string;
        referenceText?: string;
    };
}

