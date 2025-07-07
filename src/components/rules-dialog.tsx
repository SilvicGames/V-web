"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RulesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesDialog({ isOpen, onClose }: RulesDialogProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary/95 border-4 border-border/50 text-foreground font-body sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-primary-foreground text-shadow-lg text-center">
            {t.rulesTitle}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] md:h-[50vh] pr-4">
            <div className="space-y-4 text-foreground/90">
                <h3 className="font-bold text-lg text-primary">{t.rulesObjectiveTitle}</h3>
                <p>{t.rulesObjectiveText}</p>

                <h3 className="font-bold text-lg text-primary">{t.rulesGameplayTitle}</h3>
                <ul className="list-disc space-y-2 pl-5">
                    <li>{t.rulesGameplay1}</li>
                    <li>{t.rulesGameplay2}</li>
                    <li>{t.rulesGameplay3}</li>
                    <li>{t.rulesGameplay4}</li>
                    <li>{t.rulesGameplay5}</li>
                    <li>{t.rulesGameplay6}</li>
                </ul>

                <h3 className="font-bold text-lg text-primary">{t.rulesScoringTitle}</h3>
                <ul className="list-disc space-y-2 pl-5">
                    <li>{t.rulesScoring1}</li>
                    <li>{t.rulesScoring2}</li>
                    <li>{t.rulesScoring3}</li>
                </ul>
            </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button 
            onClick={onClose} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display text-2xl py-6 rounded-lg tracking-wide"
          >
            {t.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
