export interface FormHandle {
  submit: () => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  getValues: () => any;
  submitWithData: (data: any) => Promise<boolean>;
}
