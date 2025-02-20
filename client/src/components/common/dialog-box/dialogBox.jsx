import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

const DialogBox = ({ dialogOpen, setDialogOpen, children }) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full max-w-lg min-w-[350px] md:min-w-[500px] lg:min-w-[600px] bg-white shadow-xl rounded-xl transition-all duration-300 "
      >
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
