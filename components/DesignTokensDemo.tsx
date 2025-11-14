/**
 * Composant de démonstration des Design Tokens
 * 
 * Ce composant montre toutes les couleurs et tokens disponibles
 * pour référence visuelle et test du système de design.
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HABIT_COLORS, 
  STATUS_COLORS, 
  getHabitColorClass,
  getStatusColorClass,
  type HabitColorKey,
  type StatusColorKey 
} from "@/lib/design-tokens";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

export function DesignTokensDemo() {
  return (
    <div className="min-h-screen bg-background-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground-800">
            Design Tokens - Habit Tracker
          </h1>
          <p className="text-xl text-foreground-400">
            Système de design complet avec support dark/light mode
          </p>
        </div>

        {/* Background Tokens */}
        <Card className="bg-background-300 border-background-500">
          <CardHeader>
            <CardTitle className="text-foreground-800">Background Tokens</CardTitle>
            <CardDescription className="text-foreground-400">
              5 niveaux d'élévation et de profondeur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {[100, 200, 300, 400, 500].map((level) => (
                <div key={level} className="space-y-2">
                  <div 
                    className={`h-24 rounded-lg border border-background-500 bg-background-${level}`}
                  />
                  <p className="text-sm text-foreground-500 text-center">
                    bg-background-{level}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Foreground Tokens */}
        <Card className="bg-background-300 border-background-500">
          <CardHeader>
            <CardTitle className="text-foreground-800">Foreground Tokens</CardTitle>
            <CardDescription className="text-foreground-400">
              9 niveaux de hiérarchie typographique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-foreground-100">text-foreground-100 - Disabled text</p>
              <p className="text-foreground-200">text-foreground-200 - Placeholder text</p>
              <p className="text-foreground-300">text-foreground-300 - Secondary text</p>
              <p className="text-foreground-400">text-foreground-400 - Tertiary text</p>
              <p className="text-foreground-500">text-foreground-500 - Body text (standard)</p>
              <p className="text-foreground-600">text-foreground-600 - Subheadings</p>
              <p className="text-foreground-700">text-foreground-700 - Headings</p>
              <p className="text-foreground-800">text-foreground-800 - Primary text</p>
              <p className="text-foreground-900">text-foreground-900 - High contrast</p>
            </div>
          </CardContent>
        </Card>

        {/* Habit Colors */}
        <Card className="bg-background-300 border-background-500">
          <CardHeader>
            <CardTitle className="text-foreground-800">Accent Colors - Catégories d'habitudes</CardTitle>
            <CardDescription className="text-foreground-400">
              Couleurs vibrantes pour différencier les types d'habitudes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(HABIT_COLORS).map(([key, color]) => (
                <div key={key} className="space-y-3">
                  <div className="space-y-2">
                    {/* Solid variant */}
                    <div 
                      className={`h-16 rounded-lg ${color.class} flex items-center justify-center`}
                    >
                      <span className="text-background-100 font-semibold">
                        {color.name}
                      </span>
                    </div>
                    
                    {/* Light variant */}
                    <div 
                      className={`h-12 rounded-lg ${color.lightClass} flex items-center justify-center border border-background-500`}
                    >
                      <span className={`font-medium text-[${color.value}]`}>
                        Light variant
                      </span>
                    </div>
                  </div>
                  
                  {/* Badge examples */}
                  <div className="flex gap-2">
                    <Badge className={getHabitColorClass(key as HabitColorKey, 'solid') + ' text-background-100'}>
                      Badge
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`border-[${color.value}] text-[${color.value}]`}
                    >
                      Outline
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-foreground-400 font-mono">
                    {key}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Colors */}
        <Card className="bg-background-300 border-background-500">
          <CardHeader>
            <CardTitle className="text-foreground-800">Status Colors - Feedback</CardTitle>
            <CardDescription className="text-foreground-400">
              Couleurs pour les états et feedbacks utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Success */}
              <div className={`p-6 rounded-lg ${STATUS_COLORS.success.lightClass} border-2 ${STATUS_COLORS.success.borderClass}`}>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className={STATUS_COLORS.success.textClass} />
                  <h3 className={`font-semibold ${STATUS_COLORS.success.textClass}`}>
                    Success
                  </h3>
                </div>
                <p className="text-foreground-500 text-sm">
                  Habitude complétée avec succès ! Votre streak continue.
                </p>
                <Button 
                  className={`mt-4 ${getStatusColorClass('success', 'solid')} text-background-100`}
                  size="sm"
                >
                  Action
                </Button>
              </div>

              {/* Warning */}
              <div className={`p-6 rounded-lg ${STATUS_COLORS.warning.lightClass} border-2 ${STATUS_COLORS.warning.borderClass}`}>
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className={STATUS_COLORS.warning.textClass} />
                  <h3 className={`font-semibold ${STATUS_COLORS.warning.textClass}`}>
                    Warning
                  </h3>
                </div>
                <p className="text-foreground-500 text-sm">
                  Attention ! Votre streak est en danger. Complétez votre habitude aujourd'hui.
                </p>
                <Button 
                  className={`mt-4 ${getStatusColorClass('warning', 'solid')} text-background-100`}
                  size="sm"
                >
                  Compléter
                </Button>
              </div>

              {/* Error */}
              <div className={`p-6 rounded-lg ${STATUS_COLORS.error.lightClass} border-2 ${STATUS_COLORS.error.borderClass}`}>
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className={STATUS_COLORS.error.textClass} />
                  <h3 className={`font-semibold ${STATUS_COLORS.error.textClass}`}>
                    Error
                  </h3>
                </div>
                <p className="text-foreground-500 text-sm">
                  Vous avez manqué cette habitude. Votre streak a été réinitialisé.
                </p>
                <Button 
                  className={`mt-4 ${getStatusColorClass('error', 'solid')} text-background-100`}
                  size="sm"
                >
                  Recommencer
                </Button>
              </div>

              {/* Info */}
              <div className={`p-6 rounded-lg ${STATUS_COLORS.info.lightClass} border-2 ${STATUS_COLORS.info.borderClass}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Info className={STATUS_COLORS.info.textClass} />
                  <h3 className={`font-semibold ${STATUS_COLORS.info.textClass}`}>
                    Info
                  </h3>
                </div>
                <p className="text-foreground-500 text-sm">
                  💡 Astuce : Complétez vos habitudes le matin pour un meilleur taux de réussite.
                </p>
                <Button 
                  variant="outline"
                  className={`mt-4 ${STATUS_COLORS.info.borderClass} ${STATUS_COLORS.info.textClass}`}
                  size="sm"
                >
                  En savoir plus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components Examples */}
        <Card className="bg-background-300 border-background-500">
          <CardHeader>
            <CardTitle className="text-foreground-800">shadcn/ui Components</CardTitle>
            <CardDescription className="text-foreground-400">
              Composants avec tokens intégrés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Buttons */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground-700">Buttons</h4>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground-700">Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-foreground-400">
            🎨 Tous les tokens sont automatiquement adaptés au mode sombre/clair
          </p>
          <p className="text-foreground-300 text-sm mt-2">
            Basé sur l'analyse de la direction artistique du dossier /inspiration
          </p>
        </div>
      </div>
    </div>
  );
}
