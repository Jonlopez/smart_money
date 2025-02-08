import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class I18n {
    constructor() {
        this.translations = {};
        this.defaultLocale = 'es';
        this.currentLocale = 'es';
        this.loadTranslations();
    }

    loadTranslations() {
        const localesPath = path.join(__dirname, '../locales');
        try {
            fs.readdirSync(localesPath).forEach(file => {
                const locale = file.replace('.json', '');
                this.translations[locale] = JSON.parse(
                    fs.readFileSync(path.join(localesPath, file), 'utf8')
                );
            });
        } catch (error) {
            console.error('Error cargando traducciones:', error);
            this.translations = {};
        }
    }

    t(key) {
        const locale = this.currentLocale;
        const keys = key.split('.');
        let translation = this.translations[locale];
        
        for (const k of keys) {
            translation = translation?.[k];
            if (!translation) {
                // Si no encuentra la traducción, intenta con el idioma por defecto
                let defaultTranslation = this.translations[this.defaultLocale];
                for (const dk of keys) {
                    defaultTranslation = defaultTranslation?.[dk];
                    if (!defaultTranslation) break;
                }
                return defaultTranslation || key;
            }
        }

        return translation || key;
    }

    setCurrentLocale(locale) {
        if (this.translations[locale]) {
            this.currentLocale = locale;
        } else {
            console.warn(`Locale ${locale} not found, falling back to ${this.defaultLocale}`);
            this.currentLocale = this.defaultLocale;
        }
    }

}

export default new I18n();