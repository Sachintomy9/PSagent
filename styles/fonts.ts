export const fonts = {
    PoppinsBlack: 'Poppins-Black',
    PoppinsBold: 'Poppins-Bold',
    PoppinsExtraBold: 'Poppins-ExtraBold',
    PoppinsExtraLight: 'Poppins-ExtraLight',
    PoppinsMedium: 'Poppins-Medium',
    PoppinsRegular: 'Poppins-Regular',
    PoppinsSemiBold: 'Poppins-SemiBold',
    PoppinsThin: 'Poppins-Thin', 
} as const;

export type fontName = keyof typeof fonts