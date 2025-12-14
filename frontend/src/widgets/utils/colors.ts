export const colors = {
    transparent: 'transparent',

    primary: 'var(--primary)',
    onPrimary: 'var(--on-primary)',

    secondary: 'var(--secondary)',
    onSecondary: 'var(--on-secondary)',

    tertiary: 'var(--tertiary)',
    onTertiary: 'var(--on-tertiary)',

    containerLow: 'var(--container-low)',
    container: 'var(--container)',
    containerHigh: 'var(--container-high)',
    containerHighest: 'var(--container-highest)',

    primaryContainer: 'var(--primary-container)',
    onPrimaryContainer: 'var(--on-primary-container)',

    secondaryContainer: 'var(--secondary-container)',
    onSecondaryContainer: 'var(--on-secondary-container)',

    tertiaryContainer: 'var(--tertiary-container)',
    onTertiaryContainer: 'var(--on-tertiary-container)',

    background: 'var(--background)',
    onBackground: 'var(--on-background)',

    outline: 'var(--outline)',
} as const;

export type ColorsVarKey = keyof typeof colors;