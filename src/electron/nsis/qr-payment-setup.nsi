!include LogicLib.nsh
!include nsDialogs.nsh

!macro customPageAfterChangeDir
Var Dialog
Var AllowQRPayments
Var BIC
Var RecipientName
Var IBAN
Var PaymentReason
Var ReferenceText
Var BICLabel
Var RecipientNameLabel
Var IBANLabel
Var PaymentReasonLabel
Var ReferenceTextLabel

Page custom CustomPage CustomPageLeave

Function CustomPage
    nsDialogs::Create 1018
    Pop $Dialog

    ${NSD_CreateCheckbox} 10 10 200 12u "Allow QR Payments"
    Pop $AllowQRPayments
    ${NSD_OnClick} $AllowQRPayments EnableDisableFields

    ${NSD_CreateLabel} 10 30 200 12u "BIC (Kód banky):"
    Pop $BICLabel
    ${NSD_CreateText} 10 45 300 12u ""
    Pop $BIC
    EnableWindow $BIC 0

    ${NSD_CreateLabel} 10 65 200 12u "Jméno Příjemce:"
    Pop $RecipientNameLabel
    ${NSD_CreateText} 10 80 300 12u ""
    Pop $RecipientName
    EnableWindow $RecipientName 0

    ${NSD_CreateLabel} 10 100 200 12u "IBAN:"
    Pop $IBANLabel
    ${NSD_CreateText} 10 115 300 12u ""
    Pop $IBAN
    EnableWindow $IBAN 0

    ${NSD_CreateLabel} 10 135 200 12u "Důvod platby:"
    Pop $PaymentReasonLabel
    ${NSD_CreateText} 10 150 300 12u ""
    Pop $PaymentReason
    EnableWindow $PaymentReason 0

    ${NSD_CreateLabel} 10 170 200 12u "Referenční text:"
    Pop $ReferenceTextLabel
    ${NSD_CreateText} 10 185 300 12u "Objednávka {order}"
    Pop $ReferenceText
    EnableWindow $ReferenceText 0

    ShowWindow $BIC ${SW_HIDE} 
    ShowWindow $RecipientName ${SW_HIDE} 
    ShowWindow $IBAN ${SW_HIDE} 
    ShowWindow $PaymentReason ${SW_HIDE} 
    ShowWindow $ReferenceText ${SW_HIDE} 
    ShowWindow $BICLabel ${SW_HIDE}
    ShowWindow $RecipientNameLabel ${SW_HIDE}
    ShowWindow $IBANLabel ${SW_HIDE}
    ShowWindow $PaymentReasonLabel ${SW_HIDE}
    ShowWindow $ReferenceTextLabel ${SW_HIDE}

    nsDialogs::Show
FunctionEnd

Function EnableDisableFields
    ${NSD_GetState} $AllowQRPayments $0
    ${If} $0 == ${BST_CHECKED}
        EnableWindow $BIC 1
        EnableWindow $RecipientName 1
        EnableWindow $IBAN 1
        EnableWindow $PaymentReason 1
        EnableWindow $ReferenceText 1        
        ShowWindow $BIC ${SW_SHOW}
        ShowWindow $RecipientName ${SW_SHOW}
        ShowWindow $IBAN ${SW_SHOW}
        ShowWindow $PaymentReason ${SW_SHOW}
        ShowWindow $ReferenceText ${SW_SHOW}
        ShowWindow $BICLabel ${SW_SHOW}
        ShowWindow $RecipientNameLabel ${SW_SHOW}
        ShowWindow $IBANLabel ${SW_SHOW}
        ShowWindow $PaymentReasonLabel ${SW_SHOW}
        ShowWindow $ReferenceTextLabel ${SW_SHOW}
    ${Else}
        EnableWindow $BIC 0
        EnableWindow $RecipientName 0
        EnableWindow $IBAN 0
        EnableWindow $PaymentReason 0
        EnableWindow $ReferenceText 0
        ShowWindow $BIC ${SW_HIDE} 
        ShowWindow $RecipientName ${SW_HIDE} 
        ShowWindow $IBAN ${SW_HIDE} 
        ShowWindow $PaymentReason ${SW_HIDE} 
        ShowWindow $ReferenceText ${SW_HIDE} 
        ShowWindow $BICLabel ${SW_HIDE}
        ShowWindow $RecipientNameLabel ${SW_HIDE}
        ShowWindow $IBANLabel ${SW_HIDE}
        ShowWindow $PaymentReasonLabel ${SW_HIDE}
        ShowWindow $ReferenceTextLabel ${SW_HIDE}
    ${EndIf}
FunctionEnd

Function CustomPageLeave
    ${NSD_GetState} $AllowQRPayments $0
    ${If} $0 == ${BST_CHECKED}
        StrCpy $0 "true"
    ${Else}
        StrCpy $0 "false"
    ${EndIf}

    ${NSD_GetText} $BIC $1
    ${NSD_GetText} $RecipientName $2
    ${NSD_GetText} $IBAN $3
    ${NSD_GetText} $PaymentReason $4
    ${NSD_GetText} $ReferenceText $5
    
    ; Construct JSON string manually
    FileOpen $9 "$INSTDIR\settings.json" w
    FileWrite $9 "{"
    FileWrite $9 '"allowQRPayments": $0,'
    FileWrite $9 ' "bic": "$1",'
    FileWrite $9 ' "recipientName": "$2",'
    FileWrite $9 ' "iban": "$3",'
    FileWrite $9 ' "paymentReason": "$4",'
    FileWrite $9 ' "referenceText": "$5"'
    FileWrite $9 '}'
    FileClose $9
FunctionEnd
!macroend
